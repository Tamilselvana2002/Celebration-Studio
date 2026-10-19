"""
Celebration Studio — Static GitHub Pages Exporter
Converts any celebration into a 100% standalone static website (HTML, CSS, JS, Media)
that can be hosted completely free on GitHub Pages.
"""

import os
import sys
import shutil
import json
import re

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'celebration_studio.settings')
import django
django.setup()

from django.template.loader import render_to_string
from django.conf import settings
from celebrations.models import Celebration, Publication
from celebrations.animation_registry import resolve_celebration_animations


if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


def export_celebration_to_static(slug=None, output_dir='dist'):
    if slug:
        try:
            celebration = Celebration.objects.prefetch_related('scenes', 'participants__recipient').get(slug=slug)
        except Celebration.DoesNotExist:
            print(f"Error: Celebration with slug '{slug}' not found.")
            sys.exit(1)
    else:
        # Default to the most recently created or updated celebration
        celebration = Celebration.objects.prefetch_related('scenes', 'participants__recipient').order_by('-updated_at', '-created_at').first()
        if not celebration:
            print("Error: No celebrations found in database.")
            sys.exit(1)

    print(f"[*] Exporting Celebration: '{celebration.title}' (Slug: {celebration.slug})...")

    # Ensure celebration is published
    publication, _ = Publication.objects.get_or_create(celebration=celebration)
    publication.is_published = True
    publication.save()

    celebration.status = 'published'
    celebration.save(update_fields=['status'])

    # Prepare animation & audio configs
    anim_config = resolve_celebration_animations(celebration)
    audio_config = celebration.get_default_audio_config()

    # If custom audio is set, update audio_config to relative path
    if celebration.custom_audio:
        audio_config['source_type'] = 'custom'
        audio_config['custom_url'] = './media/' + os.path.basename(celebration.custom_audio.name)

    context = {
        'celebration': celebration,
        'scenes': celebration.scenes.all(),
        'publication': publication,
        'animation_config': anim_config,
        'animation_config_json': json.dumps(anim_config),
        'audio_config': audio_config,
        'audio_config_json': json.dumps(audio_config),
    }

    # Render HTML template
    html_content = render_to_string('public_celebration.html', context)

    # Convert absolute root URLs to relative paths for GitHub Pages subfolder compatibility
    html_content = html_content.replace('href="/static/', 'href="./static/')
    html_content = html_content.replace('src="/static/', 'src="./static/')
    html_content = html_content.replace('src="/media/', 'src="./media/')
    html_content = html_content.replace('href="/media/', 'href="./media/')
    html_content = html_content.replace('"/media/', '"./media/')
    html_content = html_content.replace("'/media/", "'./media/")

    # Setup output directory (safely preserves .git folder if present)
    output_path = os.path.abspath(output_dir)
    os.makedirs(output_path, exist_ok=True)
    for item in os.listdir(output_path):
        if item == '.git':
            continue
        item_path = os.path.join(output_path, item)
        if os.path.isdir(item_path):
            shutil.rmtree(item_path)
        else:
            os.remove(item_path)

    # 1. Write index.html
    index_file = os.path.join(output_path, 'index.html')
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"  [+] Created {index_file}")

    # 2. Copy static files
    static_src = os.path.join(settings.BASE_DIR, 'static')
    static_dest = os.path.join(output_path, 'static')
    if os.path.exists(static_src):
        shutil.copytree(static_src, static_dest)
        print(f"  [+] Copied static assets to {static_dest}")

    # 3. Copy media assets if present
    media_src = os.path.join(settings.BASE_DIR, 'media')
    media_dest = os.path.join(output_path, 'media')
    if os.path.exists(media_src) and os.listdir(media_src):
        shutil.copytree(media_src, media_dest)
        print(f"  [+] Copied media assets to {media_dest}")
    else:
        os.makedirs(media_dest, exist_ok=True)

    # 4. Create .nojekyll (ensures GitHub Pages does not ignore underscore files)
    nojekyll_file = os.path.join(output_path, '.nojekyll')
    with open(nojekyll_file, 'w', encoding='utf-8') as f:
        f.write('')
    print(f"  [+] Created {nojekyll_file}")

    # 5. Create GitHub Pages Deployment Guide
    readme_file = os.path.join(output_path, 'README.md')
    with open(readme_file, 'w', encoding='utf-8') as f:
        f.write(f"""# {celebration.title} — Static Celebration Journey

This directory is ready to be published on **GitHub Pages**.

## How to Publish to GitHub Pages:

### Step 1: Create a new GitHub Repository
1. Go to [GitHub.com](https://github.com) and click **New Repository**.
2. Name it (e.g. `birthday-wish` or `celebration`).
3. Set it to **Public** and create it.

### Step 2: Push these files to GitHub
In this folder (`{output_dir}`), run:
```bash
git init
git add .
git commit -m "Publish celebration static build"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

### Step 3: Turn on GitHub Pages
1. In your GitHub repository, click **Settings** (tab at the top).
2. On the left sidebar, click **Pages**.
3. Under **Build and deployment > Branch**, select `main` and `/ (root)`, then click **Save**.
4. Within 1-2 minutes, GitHub will give you your live URL:
   `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

Send that link to your friends! It will stay online forever with zero hosting fees.
""")
    print(f"  [+] Created {readme_file}")

    print(f"\n[SUCCESS] Celebration exported to '{output_dir}/'!")
    print(f"You can now publish the contents of '{output_dir}/' directly to GitHub Pages.")



if __name__ == '__main__':
    slug_arg = sys.argv[1] if len(sys.argv) > 1 else None
    out_arg = sys.argv[2] if len(sys.argv) > 2 else 'dist'
    export_celebration_to_static(slug=slug_arg, output_dir=out_arg)
