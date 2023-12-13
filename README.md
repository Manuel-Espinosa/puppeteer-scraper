# Puppeteer Scraper

A Node.js based web scraper utilizing Puppeteer to navigate and scrape data from web pages programmatically.

## Description

The `puppeteer-scraper` is a scalable web scraping tool designed to automate the data extraction process from websites. It leverages Puppeteer for browser automation and Express.js to serve the scraped data.

## Getting Started

### Prerequisites

- Docker
- Node.js (v18)
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Manuel-Espinosa/puppeteer-scraper.git
cd puppeteer-scraper
```

2. Build the Docker image:

```bash
docker-compose build web-scraper
```

This command builds the Docker image for the `web-scraper` service as defined in the `Dockerfile`.

### Configuration

- Create a `.env` file in the root directory of your project.
- Define the necessary environment variables like `APP_PORT`, `NODE_ENV`, and `MAX_CONCURRENT_SESSIONS`.

For example:

```env
APP_PORT=8080
NODE_ENV=production
MAX_CONCURRENT_SESSIONS=10
```

### Running the application

To start the application, use the following command:

```bash
docker-compose up -d
```

This command will start all services as defined in `docker-compose.yml`, including the `nginx-reverse-proxy`, `web-scraper`, and `chromium-node` services.

### Accessing the application

- The application will be accessible via `http://localhost:${APP_PORT}` where `${APP_PORT}` is the port number specified in your `.env` file.
- For development purposes, you can also run `npm run dev` to start the application with nodemon, which will automatically restart the app when changes are made.

### Testing

Currently, no tests are specified. To set up testing, you can modify the `test` script in `package.json`.

```json
"scripts": {
    "test": "echo "Error: no test specified" && exit 1"
}
```

## Usage

After running the application, it will start scraping based on the endpoints defined in `src/interface_adapters/routes.js`. This project depends on the [meli-price-tracker](https://github.com/Manuel-Espinosa/meli-price-tracker.git)

## Contributing

Please report any bugs or issues you find on the [issues page](https://github.com/Manuel-Espinosa/puppeteer-scraper/issues).

## Author

Manuel Espinosa

## License

This project is licensed under the MIT License