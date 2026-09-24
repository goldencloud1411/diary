export const vocabulary = [
  { word: '하루', romanization: 'haru', meaning: 'día', example: '오늘도 좋은 하루 보내세요.', translation: 'Que tengas un buen día hoy también.' },
  { word: '습관', romanization: 'seupgwan', meaning: 'hábito', example: '작은 습관이 큰 변화를 만들어요.', translation: 'Un pequeño hábito crea un gran cambio.' },
  { word: '건강', romanization: 'geongang', meaning: 'salud', example: '건강을 위해 물을 자주 마셔요.', translation: 'Bebo agua seguido por mi salud.' },
  { word: '공부', romanization: 'gongbu', meaning: 'estudio', example: '저는 매일 한국어를 공부해요.', translation: 'Estudio coreano todos los días.' },
  { word: '일', romanization: 'il', meaning: 'trabajo / asunto', example: '오늘 할 일이 많아요.', translation: 'Hoy tengo muchas cosas que hacer.' },
  { word: '책', romanization: 'chaek', meaning: 'libro', example: '잠들기 전에 책을 읽어요.', translation: 'Leo un libro antes de dormir.' },
  { word: '돈', romanization: 'don', meaning: 'dinero', example: '이번 달에는 돈을 아끼고 싶어요.', translation: 'Este mes quiero ahorrar dinero.' },
  { word: '시간', romanization: 'sigan', meaning: 'tiempo', example: '시간을 잘 관리하고 싶어요.', translation: 'Quiero gestionar bien mi tiempo.' },
  { word: '계획', romanization: 'gyehoek', meaning: 'plan', example: '주말 계획을 세웠어요.', translation: 'Hice un plan para el fin de semana.' },
  { word: '기록', romanization: 'girok', meaning: 'registro / anotación', example: '매일 짧게 기록해요.', translation: 'Hago una anotación breve cada día.' },
  { word: '목표', romanization: 'mokpyo', meaning: 'meta', example: '이번 주 목표가 세 개 있어요.', translation: 'Tengo tres metas esta semana.' },
  { word: '마음', romanization: 'maeum', meaning: 'corazón / ánimo', example: '오늘은 마음이 편해요.', translation: 'Hoy me siento tranquila.' },
  { word: '천천히', romanization: 'cheoncheonhi', meaning: 'despacio', example: '천천히 해도 괜찮아요.', translation: 'Está bien hacerlo despacio.' },
  { word: '꾸준히', romanization: 'kkuzunhi', meaning: 'constantemente', example: '매일 꾸준히 연습해요.', translation: 'Practico con constancia todos los días.' },
];

export const grammar = [
  { pattern: '-고 싶어요', meaning: 'quiero… / me gustaría…', explanation: 'Se añade a la raíz verbal para expresar deseo.', example: '한국에 가고 싶어요.', translation: 'Quiero ir a Corea.' },
  { pattern: '-아/어서', meaning: 'porque / y entonces', explanation: 'Conecta acciones o expresa una causa de forma natural.', example: '피곤해서 일찍 잤어요.', translation: 'Dormí temprano porque estaba cansada.' },
  { pattern: '-(으)려고 해요', meaning: 'pienso / tengo la intención de…', explanation: 'Expresa una intención o plan próximo.', example: '오늘 책을 읽으려고 해요.', translation: 'Pienso leer un libro hoy.' },
  { pattern: '-고 있어요', meaning: 'estar + gerundio', explanation: 'Indica una acción en progreso.', example: '지금 공부하고 있어요.', translation: 'Ahora estoy estudiando.' },
  { pattern: '-아/어도 돼요', meaning: 'se puede / está permitido', explanation: 'Se usa para dar o pedir permiso.', example: '여기 앉아도 돼요?', translation: '¿Puedo sentarme aquí?' },
  { pattern: '-(으)면', meaning: 'si / cuando', explanation: 'Introduce una condición.', example: '시간이 있으면 운동해요.', translation: 'Si tengo tiempo, hago ejercicio.' },
  { pattern: '-지만', meaning: 'pero / aunque', explanation: 'Contrasta dos ideas.', example: '바쁘지만 괜찮아요.', translation: 'Estoy ocupada, pero estoy bien.' },
  { pattern: '-기 전에', meaning: 'antes de…', explanation: 'Indica una acción previa a otra.', example: '자기 전에 물을 마셔요.', translation: 'Bebo agua antes de dormir.' },
  { pattern: '-(으)ㄴ 후에', meaning: 'después de…', explanation: 'Indica que una acción ocurre después de otra.', example: '일한 후에 쉬어요.', translation: 'Descanso después de trabajar.' },
  { pattern: '-아/어야 해요', meaning: 'tener que / deber', explanation: 'Expresa obligación o necesidad.', example: '오늘 숙제를 해야 해요.', translation: 'Hoy tengo que hacer la tarea.' },
  { pattern: '-(으)ㄹ 수 있어요', meaning: 'poder / ser capaz de', explanation: 'Expresa capacidad o posibilidad.', example: '한국어를 조금 말할 수 있어요.', translation: 'Puedo hablar un poco de coreano.' },
  { pattern: '-는 것 같아요', meaning: 'parece que… / creo que…', explanation: 'Suaviza una impresión u opinión.', example: '비가 오는 것 같아요.', translation: 'Parece que está lloviendo.' },
  { pattern: '-부터 -까지', meaning: 'desde… hasta…', explanation: 'Marca un rango de tiempo o lugar.', example: '아홉 시부터 다섯 시까지 일해요.', translation: 'Trabajo de nueve a cinco.' },
  { pattern: '-마다', meaning: 'cada…', explanation: 'Indica repetición en cada unidad de tiempo o lugar.', example: '주말마다 책을 읽어요.', translation: 'Leo cada fin de semana.' },
];

export function getDailyKorean(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const day = Math.floor(diff / 86400000);
  return {
    vocabulary: vocabulary[day % vocabulary.length],
    grammar: grammar[day % grammar.length],
  };
}
