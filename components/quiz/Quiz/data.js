'use strict';

export default {
    "scenarios": {
        "#main" : [ "1", "selectGatesType", "3", "4", "5", "6", "7" ],
        "selectGatesType.answer5" : [ "snFoundation", "snWicket", "snFacade", "#Parent.5" ],
        "selectGatesType.answer2" : [ "snWicket","snFacade","#Parent.5" ]
    },
    "questions": {
        "1": {
            "scene": "BadgeWithIndicatorGrid",
            "quest" : "Чи да?",
            "amountOfSelect": [1, 2],
            "answers": {
                "1": "да",
                "2": "нет",
                "3": "а"
            }
        },
        "selectGatesType": {
            "scene": "CardsWithPictureGrid",
            "quest": "Какие ворота Вас интересуют?",
            "amountOfSelect": 1,
            "answers": {
                "1": { "text": "Откатные", "image": "" },
                "answer2": { "text": "Распашные", "image": "" },
                "3": { "text": "Секционно-подъёмные", "image": "" },
                "4": { "text": "Рулонные", "image": "" },
                "answer5": { "text": "Рольставни", "image": "" },
                "6": { "text": "Другое", "image": "" }
            }
        },
        "3": {
            "scene": "BadgeWithIndicatorGrid",
            "quest": "Куда нужны ворота?",
            "amountOfSelect": 1,
            "answers": {
                "1": "Частный дом",
                "2": "Дача",
                "3": "Многоквартирный дом",
                "4": "Промышленный объект"
            }
        }
    }
}