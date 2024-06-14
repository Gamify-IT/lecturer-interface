# Lecturer-Interface

![grafik](https://user-images.githubusercontent.com/39833217/192109229-da9ad9f8-5f6b-4b4b-9878-8aa4eea3dcfd.png)
An easy-to-use interface that lecturers can use to configure the areas of the overworld and the shown minigames.

## Development

> Beginning of additions (that work)
### Getting started

Clone the repository
```sh
git clone https://github.com/Gamify-IT/lecturer-interface.git
```

Install the dependencies
```sh
npm install
```

### Compile and Hot-Reload for Development
To run the project locally with your IDE feature and have all necessary dependencies running,
start the dependencies via docker:
```sh
docker compose -f docker-compose-dev.yaml up
```
Then start the frontend with:
```sh
npm run serve
```
You can now access the game at [localhost](http://localhost).

### Build your local changes as a docker container
To build and run your local changes as a docker container use:
```sh
docker compose up --build
```
You can remove the container with:

```sh
docker compose down
```

> End of additions
