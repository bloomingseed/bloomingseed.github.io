# python3 this file from project root
import os
import yaml
data = []
categories = sorted(['ubuntu', 'github-pages'])
output_path = '_data/nav_data.yml'
for category in categories:
    category_data = dict(title=category, posts=list(map(lambda file_name: file_name.split('.')[0], os.listdir(category))))
    data.append(category_data)
with open(output_path, 'w') as file:
    yaml.dump({'categories': data}, file, default_flow_style=False)
