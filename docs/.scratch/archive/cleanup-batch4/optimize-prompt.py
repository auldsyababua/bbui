#!/usr/bin/env python3
"""
Script to optimize the Magic Patterns prompt to fit within character limits
"""

def count_characters(file_path):
    """Count total characters in a file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return len(content), content

def analyze_sections(content):
    """Analyze character count by major sections"""
    sections = {}
    current_section = "Header"
    current_content = []
    
    for line in content.split('\n'):
        if line.startswith('## ') and not line.startswith('### '):
            if current_content:
                sections[current_section] = '\n'.join(current_content)
            current_section = line[3:]
            current_content = [line]
        else:
            current_content.append(line)
    
    if current_content:
        sections[current_section] = '\n'.join(current_content)
    
    # Print section analysis
    print("\nSection Analysis:")
    print("-" * 60)
    total = 0
    for section, text in sections.items():
        char_count = len(text)
        total += char_count
        percentage = (char_count / len(content)) * 100
        print(f"{section[:40]:<40} {char_count:>7,} chars ({percentage:>5.1f}%)")
    print("-" * 60)
    print(f"{'TOTAL':<40} {total:>7,} chars")
    
    return sections

def optimize_content(content, target_chars=50000):
    """Optimize content to fit within character limit"""
    current_chars = len(content)
    reduction_needed = current_chars - target_chars
    
    print(f"\nCurrent: {current_chars:,} characters")
    print(f"Target:  {target_chars:,} characters")
    print(f"Need to reduce: {reduction_needed:,} characters")
    
    # Optimization strategies
    optimizations = []
    
    # 1. Remove excessive code examples in Task Management section
    optimizations.append({
        'name': 'Reduce Task Management code examples',
        'find': 'TaskParser_EditModal - shadcn Form implementation',
        'action': 'condense'
    })
    
    # 2. Condense Brain Bot Chat examples
    optimizations.append({
        'name': 'Condense Brain Bot examples',
        'find': 'ChatResponse_',
        'action': 'simplify'
    })
    
    # 3. Remove redundant shadcn implementation details
    optimizations.append({
        'name': 'Remove duplicate shadcn patterns',
        'find': 'shadcn/ui Component Usage Guide',
        'action': 'remove_section'
    })
    
    # 4. Consolidate mobile patterns
    optimizations.append({
        'name': 'Consolidate mobile patterns',
        'find': 'Mobile Optimizations',
        'action': 'merge'
    })
    
    # 5. Streamline component descriptions
    optimizations.append({
        'name': 'Streamline verbose descriptions',
        'find': 'Visual Design:',
        'action': 'bulletize'
    })
    
    return optimizations

def apply_optimizations(content):
    """Apply specific optimizations to reduce content size"""
    
    # Read the full content
    lines = content.split('\n')
    optimized_lines = []
    skip_until = None
    in_verbose_section = False
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Skip the entire shadcn/ui Component Usage Guide section
        if '## shadcn/ui Component Usage Guide' in line:
            skip_until = '## '
            i += 1
            continue
            
        # Skip until we hit the next major section
        if skip_until and line.startswith(skip_until):
            skip_until = None
            
        if skip_until:
            i += 1
            continue
            
        # Condense the TaskParser_EditModal section
        if 'TaskParser_EditModal - shadcn Form implementation' in line:
            optimized_lines.append(line)
            optimized_lines.append('```tsx')
            optimized_lines.append('// Comprehensive edit form with:')
            optimized_lines.append('// - Assignee selector with avatars')
            optimized_lines.append('// - Date/time pickers')
            optimized_lines.append('// - Priority radio group')
            optimized_lines.append('// - Location selector')
            optimized_lines.append('// - Full validation')
            optimized_lines.append('// See shadcn Form docs for implementation')
            optimized_lines.append('```')
            # Skip the original verbose implementation
            while i < len(lines) and not (lines[i].startswith('**') or lines[i].startswith('###')):
                i += 1
            continue
            
        # Condense verbose Mobile Optimization sections
        if 'Mobile Optimizations' in line or 'Mobile-First Considerations' in line:
            optimized_lines.append(line)
            optimized_lines.append('- Thumb-friendly actions, voice-first input')
            optimized_lines.append('- Offline mode with sync queue')
            optimized_lines.append('- Bottom sheet modals, swipe gestures')
            optimized_lines.append('- 48px minimum touch targets')
            # Skip detailed implementation
            while i < len(lines) and not (lines[i].startswith('##') or lines[i].startswith('###')):
                i += 1
            continue
            
        # Condense Chat Response examples
        if line.startswith('**ChatResponse_'):
            # Just show the component name and brief description
            optimized_lines.append(line)
            if i + 1 < len(lines):
                # Add one line description
                i += 1
                optimized_lines.append(lines[i])
            # Skip the detailed example
            while i < len(lines) and not lines[i].startswith('**'):
                i += 1
            continue
            
        # Keep the line as-is
        optimized_lines.append(line)
        i += 1
    
    return '\n'.join(optimized_lines)

def main():
    file_path = '/Users/colinaulds/Desktop/projects/bbui/magic-patterns-prompt.md'
    
    # Count original characters
    char_count, content = count_characters(file_path)
    print(f"Original file: {char_count:,} characters")
    
    # Analyze sections
    sections = analyze_sections(content)
    
    # Apply optimizations
    print("\nApplying optimizations...")
    optimized_content = apply_optimizations(content)
    
    # Count optimized characters
    optimized_count = len(optimized_content)
    print(f"\nOptimized: {optimized_count:,} characters")
    print(f"Reduced by: {char_count - optimized_count:,} characters")
    
    if optimized_count <= 50000:
        print("\n✅ SUCCESS: Content fits within 50,000 character limit!")
        
        # Save optimized version
        output_path = '/Users/colinaulds/Desktop/projects/bbui/magic-patterns-prompt-optimized.md'
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(optimized_content)
        print(f"\nOptimized prompt saved to: {output_path}")
    else:
        print(f"\n❌ Still over limit by {optimized_count - 50000:,} characters")
        print("Need more aggressive optimization")

if __name__ == "__main__":
    main()