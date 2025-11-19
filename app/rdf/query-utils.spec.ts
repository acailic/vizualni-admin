import { describe, expect, it } from "vitest";

import { buildLocalizedSubQuery } from "./query-utils";

describe("buildLocalizedSubQuery", () => {
  it("should build a subquery with the given locale", () => {
    const subQuery = buildLocalizedSubQuery("s", "p", "o", {
      locale: "it",
    });

    // it locale must be first!
    expect(subQuery).toMatchInlineSnapshot(`
      "OPTIONAL { ?s p ?o_it . FILTER(LANG(?o_it) = "it") }
      OPTIONAL { ?s p ?o_sr . FILTER(LANG(?o_sr) = "sr") }
      OPTIONAL { ?s p ?o_en . FILTER(LANG(?o_en) = "en") }
      OPTIONAL { ?s p ?o_ . FILTER(LANG(?o_) = "") }
      BIND(COALESCE(?o_it, ?o_sr, ?o_en, ?o_) AS ?o)"
    `);
  });

  it("should build a subquery with the given locale, falling back to non-localized property", () => {
    const subQuery = buildLocalizedSubQuery("s", "p", "o", {
      locale: "en",
      fallbackToNonLocalized: true,
    });
    expect(subQuery).toMatchInlineSnapshot(`
      "OPTIONAL { ?s p ?o_en . FILTER(LANG(?o_en) = "en") }
      OPTIONAL { ?s p ?o_sr . FILTER(LANG(?o_sr) = "sr") }
      OPTIONAL { ?s p ?o_ . FILTER(LANG(?o_) = "") }
      OPTIONAL {
        ?s p ?o_raw .
      }
      BIND(COALESCE(?o_en, ?o_sr, ?o_, ?o_raw) AS ?o)"
    `);
  });
});
