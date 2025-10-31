#!/bin/bash
# Este script elimina la línea Co-authored-by: Qwen-Coder del mensaje de commit

if grep -q "Co-authored-by: Qwen-Coder" "$1"; then
    sed -i '' '/Co-authored-by: Qwen-Coder/d' "$1"
fi