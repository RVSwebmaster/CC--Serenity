# Data Model

```json
{
  "basics": {
    "name": "",
    "quote": "",
    "concept": "",
    "role": "",
    "homeworld": "",
    "background": ""
  },
  "attributes": {
    "Agility": "d4",
    "Strength": "d4",
    "Vitality": "d4",
    "Alertness": "d4",
    "Intelligence": "d4",
    "Willpower": "d4"
  },
  "traits": {
    "assets": [{ "id": "...", "name": "", "rating": "none", "notes": "" }],
    "complications": [{ "id": "...", "name": "", "rating": "none", "notes": "" }]
  },
  "skills": {
    "Athletics": {
      "generalRating": "d6",
      "specialties": [{ "id": "...", "name": "Dodge", "rating": "d10" }]
    }
  },
  "details": {
    "gear": "",
    "notes": "",
    "portraitUrl": ""
  },
  "meta": {
    "heroicLevel": "Greenhorn",
    "lastUpdated": null
  }
}
```
