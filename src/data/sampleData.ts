import { ElementsData } from '../types';

const sampleData: ElementsData = {
  "elements": [
    {
        "id": "cat1",
        "type": "categorie",
        "title": "PROBLEME DE FONCTIONNEMENT GENERAL",
        "parent": null
    },
    {
        "id": "cat2",
        "type": "categorie",
        "title": "PROBLEME DE PRESSION",
        "parent": null
    },
    {
        "id": "cat3",
        "type": "categorie",
        "title": "PROBLEME DE CHAUFFE",
        "parent": null
    },
    {
        "id": "prob1",
        "type": "probleme",
        "title": "LA MACHINE NE DEMARRE PAS",
        "parent": "cat1"
    },
    {
        "id": "prob2",
        "type": "probleme",
        "title": "PROGRAMMATEUR EN ERREUR (affiche ERR ou symboles)",
        "parent": "cat1"
    },
    {
        "id": "prob3",
        "type": "probleme",
        "title": "PROGRAMMATEUR ne s'allume pas ou clignote",
        "parent": "cat1"
    },
    {
        "id": "prob4",
        "type": "probleme",
        "title": "PLUS DE CONSOMMATION D'ANTICALCAIRE",
        "parent": "cat1"
    },
    {
        "id": "prob5",
        "type": "probleme",
        "title": "DEBORDEMENT DU BAC ANTICALCAIRE",
        "parent": "cat1"
    },
    {
        "id": "prob6",
        "type": "probleme",
        "title": "PAS DE PRESSION AU MANO (LA POMPE NE TOURNE PAS) ALORS QU'ON APPUIE SUR LA GACHETTE",
        "parent": "cat2"
    },
    {
        "id": "prob7",
        "type": "probleme",
        "title": "IMPOSSIBLE DE MONTER EN PRESSION SORTIE DE POMPE (AU MANO) ET LE MOTEUR TOURNE",
        "parent": "cat2"
    },
    {
        "id": "prob8",
        "type": "probleme",
        "title": "PRESSION OK AU MANO MAIS PAS OU PEU DE SORTIE D'EAU AUX ACCESSOIRES",
        "parent": "cat2"
    },
    {
        "id": "prob9",
        "type": "probleme",
        "title": "PRESSION SACCADEE",
        "parent": "cat2"
    },
    {
        "id": "prob10",
        "type": "probleme",
        "title": "LA POMPE NE S'ARRETE PAS (1 MINUTE MAX APRES ARRET DE LA GACHETTE)",
        "parent": "cat2"
    },
    {
        "id": "prob11",
        "type": "probleme",
        "title": "LA MACHINE NE CHAUFFE PLUS VOYANT VERT ALLUME",
        "parent": "cat3"
    },
    {
        "id": "prob12",
        "type": "probleme",
        "title": "LA MACHINE NE CHAUFFE PLUS VOYANT VERT RESTE ETEINT",
        "parent": "cat3"
    },
    {
        "id": "prob13",
        "type": "probleme",
        "title": "LA MACHINE NE CHAUFFE PAS ASSEZ",
        "parent": "cat3"
    },
    {
        "id": "prob14",
        "type": "probleme",
        "title": "VOYANT VERT S'ETEINT JUSQU'A UNE TEMPERATURE RELATIVEMENT BASSE",
        "parent": "cat3"
    },
    {
        "id": "prob15",
        "type": "probleme",
        "title": "LA MACHINE MONTE TROP EN TEMPERATURE",
        "parent": "cat3"
    },
    {
        "id": "prob16",
        "type": "probleme",
        "title": "LA MACHINE FUME BEAUCOUP",
        "parent": "cat3",
        "next": ["etatA", "etatB"]
    },
    {
        "id": "etatA",
        "type": "etat",
        "title": "PAS DE MELANGE DE CARBURANT",
        "parent": "prob16"
    },
    {
        "id": "etatB",
        "type": "etat",
        "title": "MELANGE DE CARBURANT",
        "parent": "prob16",
        "next": ["action1"]
    },
    {
        "id": "action1",
        "type": "action",
        "title": "FAIRE UNE VIDANGE COMPLETE DU CIRCUIT, CHANGER LE MELANGE",
        "parent": "etatB"
    },
    {
        "id": "etat1",
        "type": "etat",
        "title": "Le moteur de la pompe ne tourne pas ET le programmateur est éteint",
        "parent": "prob1",
        "next": ["verif1"]
    },
    {
        "id": "etat2",
        "type": "etat",
        "title": "Le moteur de la pompe ne tourne pas ET le programmateur est allumé",
        "parent": "prob1",
        "next": ["prob5"]
    },
    {
        "id": "etat3",
        "type": "etat",
        "title": "Le moteur de la pompe tourne ET le programmateur est éteint",
        "parent": "prob1",
        "next": ["prob4"]
    }
  ]
};

export default sampleData;