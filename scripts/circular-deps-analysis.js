import { ArgumentParser } from "argparse";
const fs = require("fs");
const extractLinksFromLines = (input) => {
    const lines = input
        .split("\n")
        .filter((x) => x !== "" && /^\d+\)/.exec(x))
        .map((l) => l.split(") ")[1]);
    const links = [];
    for (const line of lines) {
        const nodes = line.split(" > ");
        for (let i = 0; i < nodes.length - 1; i++) {
            links.push([nodes[i], nodes[i + 1]]);
        }
    }
    return links;
};
const countLinks = (links) => {
    const counts = new Map();
    for (const link of links) {
        const linkKey = `${link[0]} > ${link[1]}`;
        const count = counts.get(linkKey) || 0;
        counts.set(linkKey, count + 1);
    }
    return counts;
};
const mkComparator = (fn) => {
    return (a, b) => {
        const va = fn(a);
        const vb = fn(b);
        return va < vb ? -1 : va > vb ? 1 : 0;
    };
};
const main = () => {
    const parser = new ArgumentParser({
        description: "Take the ouput of madge -c and gives the links contributing the most to circular dependencies",
    });
    parser.add_argument("input");
    const args = parser.parse_args();
    const input = fs
        .readFileSync(args.input === "-" ? 0 : args.input, "utf-8")
        .toString();
    const links = extractLinksFromLines(input);
    const counts = countLinks(links);
    console.log();
    console.log(input);
    console.log();
    console.log("Here are the links between files contributing most to circular deps");
    const sorted = [...counts.entries()].sort(mkComparator(([link, count]) => -count));
    for (let [link, count] of sorted) {
        console.log(`${count}: ${link}`);
    }
};
main();
