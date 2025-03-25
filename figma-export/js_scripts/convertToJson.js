  const fs = require('fs');

  const jsonData = {
    frame: {
      name: "Fintech Startup Landing Page",
      width: 1440,
      height: 5000,
      background: "#ffffff",
    },
    elements: [
      {
        type: "section",
        name: "Header",
        position: { x: 0, y: 0 },
        size: { width: 1440, height: 100 },
        style: { background: "#1a202c" },
        childelements: [
          {
            type: "image",
            name: "Company Logo",
            position: { x: 50, y: 25 },
            size: { width: 150, height: 50 },
            imagePlaceholder:  "company-logo",
            style: {},
          },
          {
            type: "container",
            name: "Navigation Links",
            position: { x: 400, y: 40 },
            size: { width: 600, height: 50 },
            style: {},
            children: [
              {
                type: "text",
                name: "Home Link",
                position: { x: 0, y: 0 },
                size: { width: 100, height: 50 },
                style: { color: "#ffffff", "font-size": 16 },
                content: "Home",
              },
              {
                type: "text",
                name: "Features Link",
                position: { x: 120, y: 0 },
                size: { width: 100, height: 50 },
                style: { color: "#ffffff", "font-size": 16 },
                content: "Features",
              },
              {
                type: "text",
                name: "Pricing Link",
                position: { x: 240, y: 0 },
                size: { width: 100, height: 50 },
                style: { color: "#ffffff", "font-size": 16 },
                content: "Pricing",
              },
              {
                type: "text",
                name: "Testimonials Link",
                position: { x: 360, y: 0 },
                size: { width: 100, height: 50 },
                style: { color: "#ffffff", "font-size": 16 },
                content: "Testimonials",
              },
              {
                type: "text",
                name: "Contact Link",
                position: { x: 480, y: 0 },
                size: { width: 100, height: 50 },
                style: { color: "#ffffff", "font-size": 16 },
                content: "Contact",
              },
            ],
          },
          {
            type: "button",
            name: "Sign Up Button",
            position: { x: 1200, y: 25 },
            size: { width: 150, height: 50 },
            style: {
              background: "#e53e3e",
              "border-radius": 5,
            },
            children: [
              {
                type: "text",
                position: { x: 10, y: 10 },
                size: { width: 130, height: 30 },
                style: {
                  color: "#ffffff",
                  "font-size": 16,
                  "align-items": "center",
                },
                content: "Sign Up",
              },
            ],
          },
        ],
      },
      {
        type: "section",
        name: "Hero",
        position: { x: 0, y: 100 },
        size: { width: 1440, height: 750 },
        style: { background: "#f7fafc" },
        childelements: [
          {
            type: "text",
            name: "Hero Headline",
            position: { x: 200, y: 150 },
            size: { width: 800, height: 100 },
            style: { color: "#2d3748", "font-size": 48 },
            content: "Revolutionize Your Banking Experience",
          },
          {
            type: "text",
            name: "Hero Description",
            position: { x: 200, y: 280 },
            size: { width: 600, height: 80 },
            style: { color: "#4a5568", "font-size": 20 },
            content:
              "Join us to manage your finances effortlessly with our cutting-edge solutions.",
          },
          {
            type: "button",
            name: "Get Started Button",
            position: { x: 200, y: 380 },
            size: { width: 200, height: 60 },
            style: {
              background: "#3182ce",
              "border-radius": 5,
            },
            children: [
              {
                type: "text",
                position: { x: 35, y: 15 },
                size: { width: 130, height: 30 },
                style: {
                  color: "#ffffff",
                  "font-size": 18,
                  "align-items": "center",
                },
                content: "Get Started",
              },
            ],
          },
          {
            type: "image",
            name: "Hero Image",
            position: { x: 850, y: 150 },
            size: { width: 500, height: 400 },
            imagePlaceholder: "heroImage",
            style: {},
          },
        ],
      },
      {
        type: "section",
        name: "Features",
        position: { x: 0, y: 850 },
        size: { width: 1440, height: 600 },
        style: { background: "#ffffff" },
        childelements: [
          {
            type: "container",
            name: "Feature 1",
            position: { x: 150, y: 50 },
            size: { width: 400, height: 200 },
            style: {},
            children: [
              {
                type: "image",
                name: "Feature 1 Icon",
                position: { x: 150, y: 0 },
                size: { width: 80, height: 80 },
                imagePlaceholder: "feature1",
                style: {},
              },
              {
                type: "text",
                name: "Feature 1 Title",
                position: { x: 50, y: 100 },
                size: { width: 300, height: 50 },
                style: { color: "#2d3748", "font-size": 24 },
                content: "Seamless Transactions",
              },
              {
                type: "text",
                name: "Feature 1 Description",
                position: { x: 50, y: 160 },
                size: { width: 300, height: 80 },
                style: { color: "#4a5568", "font-size": 16 },
                content:
                  "Experience fast and secure transactions with our cutting-edge technology.",
              },
            ],
          },
          {
            type: "container",
            name: "Feature 2",
            position: { x: 550, y: 50 },
            size: { width: 400, height: 200 },
            style: {},
            children: [
              {
                type: "image",
                name: "Feature 2 Icon",
                position: { x: 150, y: 0 },
                size: { width: 80, height: 80 },
                imagePlaceholder: "feature2",
                style: {},
              },
              {
                type: "text",
                name: "Feature 2 Title",
                position: { x: 50, y: 100 },
                size: { width: 300, height: 50 },
                style: { color: "#2d3748", "font-size": 24 },
                content: "Smart Budgeting",
              },
              {
                type: "text",
                name: "Feature 2 Description",
                position: { x: 50, y: 160 },
                size: { width: 300, height: 80 },
                style: { color: "#4a5568", "font-size": 16 },
                content:
                  "Track your expenses and set financial goals effortlessly.",
              },
            ],
          },
          {
            type: "container",
            name: "Feature 3",
            position: { x: 950, y: 50 },
            size: { width: 400, height: 200 },
            style: {},
            children: [
              {
                type: "image",
                name: "Feature 3 Icon",
                position: { x: 150, y: 0 },
                size: { width: 80, height: 80 },
                imagePlaceholder: "feature3",
                style: {},
              },
              {
                type: "text",
                name: "Feature 3 Title",
                position: { x: 50, y: 100 },
                size: { width: 300, height: 50 },
                style: { color: "#2d3748", "font-size": 24 },
                content: "24/7 Customer Support",
              },
              {
                type: "text",
                name: "Feature 3 Description",
                position: { x: 50, y: 160 },
                size: { width: 300, height: 80 },
                style: { color: "#4a5568", "font-size": 16 },
                content:
                  "Get support anytime with our dedicated customer service team.",
              },
            ],
          },
        ],
      },
      {
        type: "section",
        name: "Testimonials",
        position: { x: 0, y: 1450 },
        size: { width: 1440, height: 600 },
        style: { background: "#f7fafc" },
        childelements: [
          {
            type: "container",
            name: "Testimonial 1",
            position: { x: 150, y: 50 },
            size: { width: 400, height: 200 },
            style: {},
            children: [
              {
                type: "image",
                name: "Avatar 1",
                position: { x: 160, y: 0 },
                size: { width: 80, height: 80 },
                imagePlaceholder: "avatar1",
                style: {},
              },
              {
                type: "text",
                name: "Customer Name 1",
                position: { x: 50, y: 100 },
                size: { width: 300, height: 40 },
                style: { color: "#2d3748", "font-size": 20 },
                content: "John Doe",
              },
              {
                type: "text",
                name: "Testimonial 1 Content",
                position: { x: 50, y: 140 },
                size: { width: 300, height: 80 },
                style: { color: "#4a5568", "font-size": 16 },
                content:
                  "This fintech platform has completely changed how I manage my finances!",
              },
            ],
          },
          {
            type: "container",
            name: "Testimonial 2",
            position: { x: 550, y: 50 },
            size: { width: 400, height: 200 },
            style: {},
            children: [
              {
                type: "image",
                name: "Avatar 2",
                position: { x: 160, y: 0 },
                size: { width: 80, height: 80 },
                imagePlaceholder: "avatar2",
                style: {},
              },
              {
                type: "text",
                name: "Customer Name 2",
                position: { x: 50, y: 100 },
                size: { width: 300, height: 40 },
                style: { color: "#2d3748", "font-size": 20 },
                content: "Jane Smith",
              },
              {
                type: "text",
                name: "Testimonial 2 Content",
                position: { x: 50, y: 140 },
                size: { width: 300, height: 80 },
                style: { color: "#4a5568", "font-size": 16 },
                content:
                  "Incredible user experience and top-notch customer service!",
              },
            ],
          },
          {
            type: "container",
            name: "Testimonial 3",
            position: { x: 950, y: 50 },
            size: { width: 400, height: 200 },
            style: {},
            children: [
              {
                type: "image",
                name: "Avatar 3",
                position: { x: 160, y: 0 },
                size: { width: 80, height: 80 },
                imagePlaceholder: "avatar3",
                style: {},
              },
              {
                type: "text",
                name: "Customer Name 3",
                position: { x: 50, y: 100 },
                size: { width: 300, height: 40 },
                style: { color: "#2d3748", "font-size": 20 },
                content: "David Johnson",
              },
              {
                type: "text",
                name: "Testimonial 3 Content",
                position: { x: 50, y: 140 },
                size: { width: 300, height: 80 },
                style: { color: "#4a5568", "font-size": 16 },
                content: "Secure, fast, and reliable—exactly what I needed!",
              },
            ],
          },
        ],
      },
      {
        type: "section",
        name: "Pricing",
        position: { x: 0, y: 2050 },
        size: { width: 1440, height: 600 },
        style: { background: "#ffffff" },
        childelements: [
          {
            type: "container",
            name: "Basic Plan",
            position: { x: 150, y: 50 },
            size: { width: 400, height: 300 },
            style: {},
            children: [
              {
                type: "text",
                name: "Plan Title",
                position: { x: 50, y: 20 },
                size: { width: 300, height: 50 },
                style: { color: "#2d3748", "font-size": 24 },
                content: "Basic Plan",
              },
              {
                type: "text",
                name: "Plan Price",
                position: { x: 50, y: 80 },
                size: { width: 300, height: 50 },
                style: { color: "#3182ce", "font-size": 20 },
                content: "$9.99/month",
              },
              {
                type: "text",
                name: "Plan Features",
                position: { x: 50, y: 140 },
                size: { width: 300, height: 100 },
                style: { color: "#4a5568", "font-size": 16 },
                content:
                  "✔ Basic transactions\n✔ Limited support\n✔ Up to 5 accounts",
              },
            ],
          },
          {
            type: "container",
            name: "Pro Plan",
            position: { x: 550, y: 50 },
            size: { width: 400, height: 300 },
            style: {},
            children: [
              {
                type: "text",
                name: "Plan Title",
                position: { x: 50, y: 20 },
                size: { width: 300, height: 50 },
                style: { color: "#2d3748", "font-size": 24 },
                content: "Pro Plan",
              },
              {
                type: "text",
                name: "Plan Price",
                position: { x: 50, y: 80 },
                size: { width: 300, height: 50 },
                style: { color: "#3182ce", "font-size": 20 },
                content: "$19.99/month",
              },
              {
                type: "text",
                name: "Plan Features",
                position: { x: 50, y: 140 },
                size: { width: 300, height: 100 },
                style: { color: "#4a5568", "font-size": 16 },
                content:
                  "✔ Advanced transactions\n✔ Priority support\n✔ Up to 15 accounts",
              },
            ],
          },
          {
            type: "container",
            name: "Enterprise Plan",
            position: { x: 950, y: 50 },
            size: { width: 400, height: 300 },
            style: {},
            children: [
              {
                type: "text",
                name: "Plan Title",
                position: { x: 50, y: 20 },
                size: { width: 300, height: 50 },
                style: { color: "#2d3748", "font-size": 24 },
                content: "Enterprise Plan",
              },
              {
                type: "text",
                name: "Plan Price",
                position: { x: 50, y: 80 },
                size: { width: 300, height: 50 },
                style: { color: "#3182ce", "font-size": 20 },
                content: "$49.99/month",
              },
              {
                type: "text",
                name: "Plan Features",
                position: { x: 50, y: 140 },
                size: { width: 300, height: 100 },
                style: { color: "#4a5568", "font-size": 16 },
                content:
                  "✔ Unlimited transactions\n✔ Dedicated support\n✔ Unlimited accounts",
              },
            ],
          },
        ],
      },
      {
        type: "section",
        name: "Final Call to Action",
        position: { x: 0, y: 2650 },
        size: { width: 1440, height: 400 },
        style: { background: "#1a202c" },
        childelements: [
          {
            type: "text",
            name: "CTA Headline",
            position: { x: 400, y: 50 },
            size: { width: 600, height: 80 },
            style: { color: "#ffffff", "font-size": 32 },
            content: "Join the Future of Banking Today!",
          },
          {
            type: "text",
            name: "CTA Description",
            position: { x: 400, y: 140 },
            size: { width: 600, height: 60 },
            style: { color: "#cbd5e0", "font-size": 18 },
            content:
              "Download our app and take control of your finances anytime, anywhere.",
          },
          {
            type: "button",
            name: "Google Play Button",
            position: { x: 500, y: 220 },
            size: { width: 180, height: 60 },
            style: {
              background: "#ffffff",
              "border-radius": 5,
            },
            children: [
              {
                type: "image",
                name: "Google Play Icon",
                position: { x: 10, y: 15 },
                size: { width: 30, height: 30 },
                imagePlaceholder: "google-play-icon",
                style: {},
              },
              {
                type: "text",
                name: "Google Play Text",
                position: { x: 60, y: 11 },
                size: { width: 120, height: 20 },
                style: { color: "#1a202c", "font-size": 16 },
                content: "Get it on Google Play",
              },
            ],
          },
          {
            type: "button",
            name: "App Store Button",
            position: { x: 700, y: 220 },
            size: { width: 180, height: 60 },
            style: {
              background: "#ffffff",
              "border-radius": 5,
            },
            children: [
              {
                type: "image",
                name: "App Store Icon",
                position: { x: 10, y: 15 },
                size: { width: 35, height: 30 },
                imagePlaceholder: "app-store-icon",
                style: {},
              },
              {
                type: "text",
                name: "App Store Text",
                position: { x: 60, y: 11 },
                size: { width: 120, height: 20 },
                style: { color: "#1a202c", "font-size": 16 },
                content: "Download on the App Storez",
              },
            ],
          },
        ],
      },
      {
        type: "section",
        name: "Footer",
        position: { x: 0, y: 3050 },
        size: { width: 1440, height: 200 },
        style: { background: "#2d3748" },
        childelements: [
          {
            type: "container",
            name: "Footer Links",
            position: { x: 200, y: 50 },
            size: { width: 800, height: 100 },
            style: {},
            children: [
              {
                type: "text",
                name: "About Us",
                position: { x: 0, y: 0 },
                size: { width: 150, height: 40 },
                style: { color: "#ffffff", "font-size": 16 },
                content: "About Us",
              },
              {
                type: "text",
                name: "Careers",
                position: { x: 160, y: 0 },
                size: { width: 150, height: 40 },
                style: { color: "#ffffff", "font-size": 16 },
                content: "Careers",
              },
              {
                type: "text",
                name: "Privacy Policy",
                position: { x: 320, y: 0 },
                size: { width: 150, height: 40 },
                style: { color: "#ffffff", "font-size": 16 },
                content: "Privacy Policy",
              },
              {
                type: "text",
                name: "Blog",
                position: { x: 480, y: 0 },
                size: { width: 150, height: 40 },
                style: { color: "#ffffff", "font-size": 16 },
                content: "Blog",
              },
            ],
          },
          {
            type: "container",
            name: "Social Media Icons",
            position: { x: 1100, y: 50 },
            size: { width: 300, height: 50 },
            style: {},
            children: [
              {
                type: "image",
                name: "Facebook Icon",
                position: { x: 0, y: 0 },
                size: { width: 40, height: 40 },
                imagePlaceholder: "facebook-icon",
                style: {},
              },
              {
                type: "image",
                name: "Twitter Icon",
                position: { x: 60, y: 0 },
                size: { width: 40, height: 40 },
                imagePlaceholder: "twitter-icon",
                style: {},
              },
              {
                type: "image",
                name: "Instagram Icon",
                position: { x: 120, y: 0 },
                size: { width: 40, height: 40 },
                imagePlaceholder: "instagram-icon",
                style: {},
              },
            ],
          },
        ],
      },
    ],
  };


  // Convert JavaScript object to JSON
const jsonString = JSON.stringify(jsonData, null, 4); // Pretty-print with indentation

// Save JSON to a file
fs.writeFileSync('output.json', jsonString, 'utf8');

console.log("JSON file has been created successfully: output.json");