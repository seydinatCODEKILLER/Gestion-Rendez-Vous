import HttpError from "../exceptions/http-error.exception.js";

export const createBaseService = ({
  repository,
  entityName = "Ressource",
  canDelete = null,
}) => {
  const getAll = async () => {
    return repository.findAll();
  };

  const getById = async (id) => {
    const entity = await repository.findById(id);
    if (!entity) {
      throw new HttpError(`${entityName} introuvable`, 404);
    }
    return entity;
  };

  const create = async (data) => {
    return repository.create(data);
  };

  const update = async (id, data) => {
    await getById(id);
    return repository.update(id, data);
  };

  const remove = async (id) => {
    const entity = await getById(id);

    if (canDelete) {
      await canDelete(entity);
    }

    return repository.remove(id);
  };

  return {
    getAll,
    getById,
    create,
    update,
    remove,
  };
};
