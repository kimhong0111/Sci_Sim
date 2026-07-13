import Subject from "./Subject.js";
import Topic from "./Topic.js";
import Simulation from "./Simulation.js";
import Simulation_Config from "./Simulation_Config.js";
import Admin from "./Admin.js";

Subject.hasMany(Topic, { foreignKey: "subject_id", onDelete: "CASCADE" });
Topic.belongsTo(Subject, { foreignKey: "subject_id" });

Subject.hasMany(Simulation, { foreignKey: "subject_id", onDelete: "CASCADE" });
Simulation.belongsTo(Subject, { foreignKey: "subject_id" });

Topic.hasMany(Simulation, { foreignKey: "topic_id", onDelete: "CASCADE" });
Simulation.belongsTo(Topic, { foreignKey: "topic_id" });

Simulation.hasOne(Simulation_Config, {
  foreignKey: "sim_id",
  onDelete: "CASCADE",
});
Simulation_Config.belongsTo(Simulation, { foreignKey: "sim_id" });

Admin.hasMany(Subject, { foreignKey: "created_by", onDelete: "RESTRICT" });
Subject.belongsTo(Admin, { foreignKey: "created_by" });

Admin.hasMany(Topic, { foreignKey: "created_by", onDelete: "RESTRICT" });
Topic.belongsTo(Admin, { foreignKey: "created_by" });

Admin.hasMany(Simulation, { foreignKey: "created_by", onDelete: "RESTRICT" });
Simulation.belongsTo(Admin, { foreignKey: "created_by" });

export { Subject, Topic, Simulation, Simulation_Config, Admin };
