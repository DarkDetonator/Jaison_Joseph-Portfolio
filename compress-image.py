import os
from PIL import Image

folder = r"dummy"  # change to your folder path

for file in os.listdir(folder):
    if file.lower().endswith(("jpg", "jpeg", "png")):
        input_path = os.path.join(folder, file)
        output_path = os.path.join(folder, os.path.splitext(file)[0] + ".webp")

        try:
            # get original file size
            original_size = os.path.getsize(input_path)

            # open and convert to WebP
            img = Image.open(input_path).convert("RGB")
            img.save(output_path, "webp", quality=70)  # adjust quality if needed

            # get new file size
            new_size = os.path.getsize(output_path)

            # print compression result
            reduction = 100 * (original_size - new_size) / original_size
            print(f"✅ {file} → {os.path.basename(output_path)} | "
                  f"Original: {original_size/1024:.1f} KB | "
                  f"WebP: {new_size/1024:.1f} KB | "
                  f"Saved: {reduction:.1f}%")

        except Exception as e:
            print(f"❌ Failed to convert {file}: {e}")
