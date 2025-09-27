# fix_jsonfield_models.py
import os
import re

def fix_model_file(file_path):
    """Fix JSONField to TextField in a model file"""
    if not os.path.exists(file_path):
        print(f"⚠️ {file_path} not found")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace JSONField patterns
    replacements = [
        # Pattern 1: JSONField with lambda default
        (r'models\.JSONField\(default=lambda:\s*\[\],', "models.TextField(default='[]',"),
        (r'models\.JSONField\(default=lambda:\s*\{\},', "models.TextField(default='{}',"),
        
        # Pattern 2: JSONField with list/dict default  
        (r'models\.JSONField\(default=list,', "models.TextField(default='[]',"),
        (r'models\.JSONField\(default=dict,', "models.TextField(default='{}',"),
        
        # Pattern 3: Simple JSONField
        (r'models\.JSONField\(', "models.TextField(default='[]', "),
    ]
    
    original_content = content
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Fixed {file_path}")
        return True
    else:
        print(f"➡️ {file_path} - no changes needed")
        return False

# Fix all model files
model_files = [
    'demographics/models.py',
    'posts/models.py', 
    'reels/models.py'
]

print("🔧 Fixing JSONField issues in models...")
for file_path in model_files:
    fix_model_file(file_path)

print("🎉 Model fixes completed!")
