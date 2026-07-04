# BigQuery Release Notes Tracker 🚀

A modern, lightweight web application to stay updated with the latest Google BigQuery releases. Built with Python Flask and a premium Vanilla JS/CSS frontend.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.13+-blue.svg)
![Flask](https://img.shields.io/badge/flask-3.0+-green.svg)

## ✨ Features

- **Live Feed Integration**: Fetches real-time updates directly from the official Google Cloud BigQuery release notes.
- **Modern UI**: Sleek dark mode interface with glassmorphism effects and smooth transitions.
- **Dynamic Refresh**: Update the feed without refreshing the page using an asynchronous fetch mechanism.
- **Twitter Integration**: Share any specific update to your X (Twitter) profile with a single click.

## 🛠️ Tech Stack

- **Backend**: [Python](https://www.python.org/) + [Flask](https://flask.palletsprojects.com/)
- **Data Parsing**: [feedparser](https://github.com/kurtmckee/feedparser)
- **Frontend**: Vanilla HTML5, CSS3 (Custom Design System), and JavaScript (ES6+)
- **Icons & Fonts**: Inter Font Family, Custom SVG icons.

## 🚀 Getting Started

### Prerequisites

- Python 3.13 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/alberto-rubio-tech4all/alrm-event-talks-app.git
   cd alrm-event-talks-app
   ```

2. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies**:
   ```bash
   pip install flask requests feedparser
   ```

### Running the App

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Open your browser** and navigate to:
   [http://127.0.0.1:5001](http://127.0.0.1:5001)

## 📁 Project Structure

```text
.
├── app.py              # Flask server and API endpoints
├── templates/
│   └── index.html      # Main application template
├── static/
│   ├── css/
│   │   └── style.css   # Premium styling and animations
│   └── js/
│       └── main.js     # Frontend logic and API integration
├── .gitignore          # Git exclusion rules
└── README.md           # This file!
```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you have ideas for new features or improvements.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Created with ❤️ by Antigravity AI.
