# Repository Cleanup - Batch 4 Archive

**Archived Date**: 2025-12-16
**Reason**: Temporary files, one-off utilities, unused configs

## Archived Items

### 1. whats-next.md
- **Purpose**: Task tracking / what's next planning
- **Why Archived**: Large file (35KB), likely superseded by other tracking
- **Contains**: Historical task tracking

### 2. optimize-prompt.py
- **Purpose**: One-off utility for prompt optimization
- **Why Archived**: One-time use script, task completed
- **Contains**: Python script for optimizing prompts

### 3. docker-compose.proxy.yml
- **Purpose**: Docker Compose proxy configuration
- **Why Archived**: Likely unused proxy setup
- **Contains**: Nginx proxy configuration for Docker

### 4. nginx-vite-proxy.conf
- **Purpose**: Nginx proxy config for Vite dev server
- **Why Archived**: Likely unused development proxy config
- **Contains**: Nginx configuration

## Restoration

```bash
# Restore specific file
git mv docs/.scratch/archive/cleanup-batch4/<filename> ./

# Restore all files
for f in docs/.scratch/archive/cleanup-batch4/*; do
  [ -f "$f" ] && [ "$(basename $f)" != "README.md" ] && git mv "$f" ./
done
```
