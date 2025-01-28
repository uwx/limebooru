# limebooru

Limebooru is an exceedingly simplistic booru clone written in SvelteKit. Unlike other boorus it's designed for a single
user, uses a SQLite database to store all the data (thus not requiring database software to be run in the background);
it also uses [WD ViT Tagger v3](https://huggingface.co/SmilingWolf/wd-vit-tagger-v3) via onnxruntime-node to tag images
in lieu of manual tagging, and all the images are stored in a single folder.

## Non-features (so far)
- No user accounts
- No image uploading (paste images into the `./images` folder instead)
- No image deletion (delete images from the `./images` folder while the app is running instead)
- No manual tag adding/removing, rating, setting Pixiv ID or source URL (maybe eventually)

## Running
Download [model.onnx](https://huggingface.co/SmilingWolf/wd-vit-tagger-v3/resolve/main/model.onnx) to
`src/lib/server/ai-tagger/model.onnx`

```bash
pnpm install
pnpm dev
```

Then, paste images into the `./images` folder.

## License

MIT