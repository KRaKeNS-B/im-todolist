import constants from '@/store/constants';

function removeUndefinedAttributes(object) {
  const newObject = { ...object };

  Object.keys(newObject).forEach((key) => {
    if (newObject[key] === undefined) {
      delete newObject[key];
    }
  });

  return newObject;
}

export default function (task) {
  return {
    ...constants.defaultTask(),
    ...(removeUndefinedAttributes(task)),
    id: task.id ? task.id : new Date().getTime(),
  };
}
