# File Explorer

This project allows you to visualize your images stored inside an Elastic database.

![darkMode](./media/dark.png)
![lightMode](./media/light.png)

## Launch application

- You need to launch frontend :

```bash
npm start
```

- You need to launch backend :

```bash
cd api
python main.py
```

## Requirements

### Database

You need to have an `elasticsearch` database,

### Environment

You need to configure your environment.
First :

```bash
mv .env.example .env
```

Then fill .env file with your informations.
`DATA_FOLDER` is the folder where you'll store all your images.

### IP Adress

Finally, you need to enter your frontend adress into `src/config.json`.

```bash
mv src/config_template.json src/config.json
```

```json
{
  "backendURL": // ex : http://localhost:8000
}
```

## TODO

- [x] Add CLIP use for image filtering,
- [x] Change elasticsearch database : store only embeddings + ref to local images and not encoded images,
- [x] Change CLIP filter to match new software structure,
- [x] Improve frontend,
- [ ] Work on an easy launching method,
- [ ] Add paging,
- [ ] Application conteneurisation,
- [ ] Allow CLIP use when offline
