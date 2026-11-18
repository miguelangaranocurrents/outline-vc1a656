import type Model from "../base/Model";

// Keyed by class identity rather than class name: names are mangled by the
// minifier, so two different models can share a name and would otherwise pick
// up each other's fields.
type ModelClass = abstract new (...args: never[]) => unknown;

const fields = new Map<ModelClass, (string | number | symbol)[]>();

/**
 * Returns the keys recorded as serializable fields on a model.
 *
 * @param target the model to inspect.
 * @returns the keys decorated with @Field.
 */
export const getFieldsForModel = <T extends Model>(target: T) =>
  getFieldsForModelClass(target.constructor as ModelClass);

/**
 * Returns the keys recorded as serializable fields on a model class.
 *
 * @param model the model class to inspect.
 * @returns the keys decorated with @Field.
 */
export function getFieldsForModelClass(model: ModelClass) {
  return fields.get(model) ?? [];
}

/**
 * A decorator that records this key as a serializable field on the model.
 * Properties decorated with @Field will be included in API requests by default.
 *
 * @param target the model the property is defined on.
 * @param propertyKey the key to record as a field.
 */
const Field = (target: Model, propertyKey: string | symbol) => {
  const model = target.constructor as ModelClass;
  fields.set(model, [...(fields.get(model) ?? []), propertyKey]);
};

export default Field;
