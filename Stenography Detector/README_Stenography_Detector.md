# 🕵️‍♀️ Stenography Detector

## Overview
A **Steganography Detection System** designed to identify hidden information in image files using statistical, structural, and entropy-based analysis.

## Key Features
- Supports `.png`, `.jpg`, `.jpeg`, and `.bmp` formats.
- Runs seven forensic tests (LSB, Chi-Square, Entropy, Pixel Differences, etc.).
- Generates an analysis report for all scanned images.
- Visual output for pixel-level differences and LSB visualization.
- Supports ZIP uploads for bulk image scanning.

## Tech Stack
`Python`, `numpy`, `matplotlib`, `PIL`, `scipy`, `os`, `zipfile`

## How to Run
1. Open `SteganographyDetector.ipynb`.
2. Upload image files or a ZIP containing multiple images.
3. Run all cells to analyze and generate `results.txt` with the detection summary.

## Outcome
Detects potentially steganographic images and visualizes image-level anomalies, aiding in digital forensics investigations.
