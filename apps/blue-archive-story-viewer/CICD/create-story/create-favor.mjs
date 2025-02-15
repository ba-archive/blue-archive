import fs from "fs";
import jsYaml from "js-yaml";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const templateFavor = jsYaml.load(
  fs.readFileSync(path.join(__dirname, "template-favor", "index.yml"), "utf8")
);

const abstractUnit = templateFavor.abstracts[0];

const Distribution = {
  Normal: 0,
  HasUniqueItem: 1,
  Custom: 2,
};

const args = process.argv.slice(2);
const studentId = args[0];
const distribution = args[1] && args[1] * 1 ? args[1] * 1 : Distribution.Normal;
let distPattern = [];

if (distribution == Distribution.Custom) {
  distPattern = args.slice(2).map(item => item * 1);
}

const groupIdMap = {
  [Distribution.Normal]: [2, 3, 5, 6],
  [Distribution.HasUniqueItem]: [2, 3, 5, 6, 15],
  [Distribution.Custom]: distPattern ?? [],
};

const distributionMap = {
  [Distribution.Normal]: groupIdMap[Distribution.Normal].map((_, idx) => {
    return {
      groupId: (studentId + "" + groupIdMap[Distribution.Normal][idx]) * 1,
      title: abstractUnit.title,
      abstract: abstractUnit.abstract,
    };
  }),
  [Distribution.HasUniqueItem]: groupIdMap[Distribution.HasUniqueItem].map(
    (_, idx) => {
      return {
        groupId:
          (studentId + "" + groupIdMap[Distribution.HasUniqueItem][idx]) * 1,
        title: abstractUnit.title,
        abstract: abstractUnit.abstract,
      };
    }
  ),
  [Distribution.Custom]: distPattern
    ? distPattern.map((_, idx) => {
        return {
          groupId: (studentId + "" + groupIdMap[Distribution.Custom][idx]) * 1,
          title: abstractUnit.title,
          abstract: abstractUnit.abstract,
        };
      })
    : [],
};

Object.freeze(Distribution);

const favorPath = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "story",
  "favor",
  studentId
);
const favorIndexPath = path.join(favorPath, "index.yml");

if (fs.existsSync(favorIndexPath)) {
  console.log("Path already exists");
  if (args.includes("--force") || args.includes("-f")) {
    console.log("Force generating...");
  } else {
    process.exit(0);
  }
} else {
  console.log("Creating path: " + favorIndexPath);
  fs.mkdirSync(favorPath, { recursive: true });
}

// 构造 index.yml
function constructIndex(studentId, distribution, distPattern) {
  const res = {
    id: studentId * 1,
    abstracts: distributionMap[distribution],
  };

  fs.writeFileSync(
    favorIndexPath,
    jsYaml.dump(JSON.parse(JSON.stringify(res, null, 2)), {
      quotingType: '"',
    })
  );
}

constructIndex(studentId, distribution, distPattern);
