# Yor Ai vs Real Image

1. What it is
A machine learning pipeline that classifies whether an image is AI-generated or a real photograph using classical texture-based computer vision features.

2. Why you built it
AI-generated imagery makes visual trust and content provenance harder. This project explores a lightweight, explainable detection workflow rather than presenting the task as a black box.

3. How it works
The system uses OpenCV for image processing, Local Binary Pattern and GLCM for texture feature extraction, Scikit-Learn to train an SVM classifier, and Streamlit for uploading images and reviewing prediction results.

4. What you learned
Feature engineering still matters. Lightweight computer vision pipelines can stay interpretable, fast, and easier to explain when the goal is practical classification rather than model spectacle.
