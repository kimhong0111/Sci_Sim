export function validateConfig(req, res, next) {
  const config = req.body.Simulation_Config;
  if (!config) return next();

  const parameters = config.parameters || config.parameter;
  if (!parameters) return next();

  if (typeof parameters !== "object" || Array.isArray(parameters)) {
    return res.status(400).json({ message: "Parameters must be an object" });
  }

  const keys = Object.keys(parameters);

  if (keys.length > 20) {
    return res.status(400).json({ message: "Too many parameters (max 20)" });
  }

  for (const [key, value] of Object.entries(parameters)) {
    if (key.length > 50) {
      return res.status(400).json({ message: `Parameter key too long: ${key}` });
    }

    if (typeof value === "object" && value !== null) {
      return res.status(400).json({ message: `Parameter "${key}" must be a simple value (number, string, or boolean)` });
    }

    if (typeof value === "number") {
      if (!Number.isFinite(value) || value > 1e6 || value < -1e6) {
        return res.status(400).json({ message: `Parameter "${key}" value out of range` });
      }
    }

    if (typeof value === "string" && value.length > 200) {
      return res.status(400).json({ message: `Parameter "${key}" string too long` });
    }
  }

  next();
}
