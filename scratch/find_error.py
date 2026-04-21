import os

def find_syntax_error(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".tsx"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    for i, line in enumerate(lines):
                        if ");" in line and i > 0:
                            prev_line = lines[i-1].strip()
                            if prev_line == "};":
                                print(f"FOUND in {path} at line {i+1}:")
                                print(f"{i}: {lines[i-1].strip()}")
                                print(f"{i+1}: {line.strip()}")
                                if i + 1 < len(lines):
                                    print(f"{i+2}: {lines[i+1].strip()}")

find_syntax_error("e:\\clique83\\clique83_coffee_date_frontend_customer\\src")
