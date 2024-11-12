# BCI Project - Data Acquisition Wizard 📊🧠

This repository contains the data acquisition component of our Brain-Computer Interface (BCI) project. Built using Next.js and the Neurosity SDK, this part of the project acts as a data collection wizard designed to streamline and guide users through the data acquisition process.

## 🚀 Overview

This data collection wizard is a vital part of the BCI project, collecting EEG data in a structured and reliable way for model training. It presents users with prompts and guides them through the recording process, ensuring consistency across data sessions. The goal is to collect steady-state visually evoked potentials (SSVEPs) with varying flashing frequencies to create a diverse and rich dataset.

## 🧭 How it Works

1. **Getting Started**: The wizard prompts the user to click a button to begin recording.
2. **Focus Prompt**: Once recording starts, a message appears asking the subject to focus on the screen.
3. **Visual Stimulus**:
   - A triangle appears and flashes at a designated frequency for a few seconds, eliciting SSVEPs.
   - A message then appears briefly before the next triangle flashes at a different frequency.
   - This process repeats for three unique frequencies, each representing a different class.
4. **Noise Class**: An additional "noise" class is recorded whenever a stimulus other than the triangle appears on the screen. For this class, the flashing frequency is set to zero.
5. **Data Storage**:
   - All collected data is saved in a CSV file.
   - The CSV includes 24 features corresponding to Alpha, Beta, and Gamma activities from eight EEG channels.
   - Additional fields for flashing frequency and stimulus type (either 'triangle' or 'noise') are also included, ensuring a well-organized dataset.

## 🛠️ Setup

To set up and run this data acquisition wizard, please follow these steps:

**Make sure you're in the /data_acquisition directory**:  
`cd data_acquisition`

1. **Install Packages**:  
   Run `npm i` to install all necessary packages.

2. **Environment Variables**:  
   Create a `.env` file in the root directory with the following variables:

   ```plaintext
   NEXT_PUBLIC_DEVICE_ID=<neuoristy_deviceId>
   NEXT_PUBLIC_EMAIL=<neuoristy_email>
   NEXT_PUBLIC_PASSWORD=<neuoristy_password>
   ```

   Replace the placeholders with your actual Neurosity credentials.

3. **Run the Wizard**:  
   Run `npm run dev` to start the Next.js server in development mode.

4. **Connect the Crown**:  
   Ensure that the Crown device is connected to the internet via WiFi. This can be done through the Neurosity mobile app.

## 🎉 Happy Data Collection!
