"""tools/tts_generate.py — Generates studio-quality neural voiceover & word timestamps using edge-tts.

Usage:
  python tools/tts_generate.py --project projects/<slug> [--voice hi-IN-MadhurNeural]
"""

import argparse
import asyncio
import json
import os
import re
import sys
import edge_tts


def time_to_sec(t_str: str) -> float:
    h, m, s = t_str.strip().split(':')
    s, ms = s.split(',')
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000.0


async def synthesize_speech(script_text: str, voice: str, out_audio: str, out_words: str, out_sentences: str = None):
    comm = edge_tts.Communicate(script_text, voice)
    submaker = edge_tts.SubMaker()

    with open(out_audio, 'wb') as fp:
        async for chunk in comm.stream():
            if chunk.get('type') == 'audio':
                fp.write(chunk['data'])
            elif chunk.get('type') == 'SentenceBoundary':
                submaker.feed(chunk)

    srt_content = submaker.get_srt()
    blocks = re.split(r'\n\s*\n', srt_content.strip())
    all_words = []
    sentences = []

    for block in blocks:
        lines = [line.strip() for line in block.split('\n') if line.strip()]
        if len(lines) < 3:
            continue

        m = re.match(r'(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})', lines[1])
        if not m:
            continue

        s_start = time_to_sec(m.group(1))
        s_end = time_to_sec(m.group(2))
        s_dur = max(0.2, s_end - s_start)

        sent_text = ' '.join(lines[2:])
        words = sent_text.split()
        if not words:
            continue

        sentences.append({
            'text': sent_text,
            'start': round(s_start, 3),
            'end': round(s_end, 3),
        })

        weights = [max(1, len(w)) for w in words]
        total_w = sum(weights)
        cur_t = s_start
        for w, wt in zip(words, weights):
            w_dur = (wt / total_w) * s_dur
            w_start = round(cur_t, 3)
            w_end = round(cur_t + w_dur, 3)
            all_words.append({'word': w, 'start': w_start, 'end': w_end})
            cur_t += w_dur

    with open(out_words, 'w', encoding='utf-8') as fp:
        json.dump({'words': all_words}, fp, indent=2)

    if out_sentences:
        with open(out_sentences, 'w', encoding='utf-8') as fp:
            json.dump({'sentences': sentences}, fp, indent=2)

    print(f"[TTS] Generated {len(all_words)} words across {len(sentences)} sentences.")
    if all_words:
        print(f"[TTS] Speech duration: {all_words[-1]['end']}s")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--project', help='Project folder under projects/')
    parser.add_argument('--script', help='Path to script file (default: <project>/input/script.txt)')
    parser.add_argument('--voice', default='hi-IN-MadhurNeural', help='TTS voice name')
    parser.add_argument('--out-audio', help='Output audio file (default: <project>/input/voiceover.mp3)')
    parser.add_argument('--out-words', help='Output words json (default: <project>/timeline/words.json)')
    args = parser.parse_args()

    project = args.project
    script_path = args.script or (os.path.join(project, 'input', 'script.txt') if project else None)
    out_audio = args.out_audio or (os.path.join(project, 'input', 'voiceover.mp3') if project else None)
    out_words = args.out_words or (os.path.join(project, 'timeline', 'words.json') if project else None)
    out_sentences = os.path.join(project, 'timeline', 'sentences.json') if project else None

    if not script_path or not os.path.exists(script_path):
        sys.exit(f"Script file not found: {script_path}")

    with open(script_path, 'r', encoding='utf-8') as fp:
        script_text = fp.read().strip()

    if not script_text:
        sys.exit("Script file is empty")

    os.makedirs(os.path.dirname(out_audio), exist_ok=True)
    os.makedirs(os.path.dirname(out_words), exist_ok=True)

    asyncio.run(synthesize_speech(script_text, args.voice, out_audio, out_words, out_sentences))


if __name__ == '__main__':
    main()
