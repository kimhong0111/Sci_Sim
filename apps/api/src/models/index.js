import Subject from "./Subject.js";
import Topic from "./Topic.js";
import Simulation from "./Simulation.js";
import Simulation_Config from "./Simulation_Config.js";
import User from "./User.js";

Subject.hasMany(Topic, { foreignKey: "subject_id", onDelete: "CASCADE" });
Topic.belongsTo(Subject, { foreignKey: "subject_id" });

Subject.hasMany(Simulation, { foreignKey: "subject_id", onDelete: "CASCADE" });
Simulation.belongsTo(Subject, { foreignKey: "subject_id" });

Topic.hasMany(Simulation, { foreignKey: "topic_id", onDelete: "CASCADE" });
Simulation.belongsTo(Topic, { foreignKey: "topic_id" });

Simulation.hasOne(Simulation_Config, {
  foreignKey: "simulation_id",
  onDelete: "CASCADE",
});
Simulation_Config.belongsTo(Simulation, { foreignKey: "simulation_id" });

export { Subject, Topic, Simulation, Simulation_Config, User };