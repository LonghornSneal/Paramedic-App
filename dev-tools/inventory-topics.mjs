import { ParamedicCategoriesData } from "../Data/ParamedicCategoriesData.js";
import fs from "fs";
import path from "path";

function gatherTopics(items, parentPath = []) {
  const topics = [];
  for (const item of items) {
    const currentPath = [...parentPath, item.title];
    const entry = {
      id: item.id,
      title: item.title,
      type: item.type,
      path: currentPath.join(" > "),
      hasDetails: Boolean(item.details),
      detailsKeys: item.details ? Object.keys(item.details) : [],
    };
    topics.push(entry);
    if (Array.isArray(item.children) && item.children.length > 0) {
      topics.push(...gatherTopics(item.children, currentPath));
    }
  }
  return topics;
}

const topics = gatherTopics(ParamedicCategoriesData);
const summary = {
  generatedAt: new Date().toISOString(),
  totalItems: topics.length,
  byType: topics.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {}),
  withoutDetails: topics.filter(t => t.type === "topic" && !t.hasDetails),
  raw: topics,
};

const outputDir = path.resolve("./research");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(path.join(outputDir, "app_topics_inventory.json"), JSON.stringify(summary, null, 2));
console.log(`Inventory written to ${path.join(outputDir, "app_topics_inventory.json")}`);
