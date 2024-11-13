import kagglehub

# Download latest version
path = kagglehub.dataset_download("rayhanzamzamy/non-and-biodegradable-waste-dataset")

print("Path to dataset files:", path)