---
title: "A Practical Image Classifier Without Inflated Claims"
date: "2026-04-12"
tags: ["ml", "computer-vision", "opencv", "svm", "python"]
excerpt: "The AI detector is a good example of a lightweight classical ML pipeline: OpenCV features, LBP/GLCM texture analysis, SVM training, and Streamlit review."
readTime: "4 min read"
category: "ML Notes"
tone: "thoughts"
featured: false
---

## The Pipeline in Plain Terms

The image classifier is not a deep learning project. That distinction matters and it is stated directly in the documentation.

The pipeline is classical: feature extraction with OpenCV, texture analysis using Local Binary Patterns (LBP) and Grey-Level Co-occurrence Matrix (GLCM) statistics, and a Support Vector Machine trained on those features. The review interface is a Streamlit app.

Each of those components has a specific, verifiable role.

## Why LBP and GLCM

Local Binary Patterns capture local texture variation in a way that is rotation-invariant and computationally cheap. For a dataset where the relevant signal is surface texture rather than semantic content — which this one is — LBP is a reasonable first choice.

GLCM statistics (contrast, correlation, energy, homogeneity) add a complementary measure of global texture regularity. Together, the two feature sets give the SVM enough discriminative surface to work with on a modest dataset.

## The SVM Choice

SVMs are interpretable relative to neural networks. The decision boundary is explicit. The model is debuggable. For a portfolio project where the goal is to demonstrate understanding of the classification process, an SVM is a more honest choice than a fine-tuned ResNet that produces good numbers but obscures the reasoning.

The accuracy is what it is on the specific dataset used. The claims in the project documentation reflect the actual test performance, not a cherry-picked validation split.

## What the Streamlit Interface Adds

The review interface exists so that predictions can be spot-checked without writing a separate script. It surfaces the confidence score alongside the prediction, and it lets a reviewer flag misclassifications.

That interactivity is practical, not decorative. A classifier you can inspect is more trustworthy than one you can only evaluate by its summary statistics.

## The Honest Assessment

This is a lightweight classical pipeline that demonstrates feature engineering and model training. It is not a production computer vision system. The documentation says so. That accuracy is itself part of what makes the project worth including.
