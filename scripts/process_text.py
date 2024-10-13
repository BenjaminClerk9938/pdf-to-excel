def process_extracted_text(text_path):
    with open(text_path, 'r') as file:
        text = file.read()
    
    # Define your splitting logic
    # Example: Assuming each issuer information is separated by a new line
    lines = text.split('\n')
    issuer_data = []
    
    for line in lines:
        if line.strip():  # Skip empty lines
            parts = line.split(" - ")  # Adjust based on actual format
            if len(parts) == 2:
                issuer_name, issuer_description = parts
                issuer_data.append({
                    'Issuer Name': issuer_name.strip(),
                    'Issuer Description': issuer_description.strip()
                })
    
    # Save processed data to JSON
    # import json
    # with open(output_path, 'w') as file:
    #     json.dump(issuer_data, file, indent=4)

# Usage
text_path = "../data/extracted_text.txt"
# output_path = "../data/processed_issuer_data.json"
process_extracted_text(text_path)
