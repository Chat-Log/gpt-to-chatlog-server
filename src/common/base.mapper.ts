interface BaseMapper<Model, Entity> {
  toEntity(model: Model): Entity;
  toModel(entity: Entity): Model;
}
