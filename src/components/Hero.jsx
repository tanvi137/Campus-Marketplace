import {
  ArrowRight,
  Heart,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function Hero({
  products = [],
  favorites = [],
  onToggleFavorite,
  onSearch,
  onCategorySelect,
  theme = "light",
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const isDark = theme === "dark";

  const featuredProducts = useMemo(() => {
    return products.slice(0, Math.min(products.length, 8));
  }, [products]);

  useEffect(() => {
    if (featuredProducts.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        return (
          (current + 1) % featuredProducts.length
        );
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  useEffect(() => {
    if (activeIndex >= featuredProducts.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, featuredProducts.length]);

  const activeProduct =
    featuredProducts[activeIndex] || products[0];

  const floatingProducts = useMemo(() => {
    if (!featuredProducts.length) {
      return [];
    }

    const result = [];

    for (let i = 1; i <= 3; i++) {
      const productIndex =
        (activeIndex + i) %
        featuredProducts.length;

      const product =
        featuredProducts[productIndex];

      if (
        product &&
        product.id !== activeProduct?.id
      ) {
        result.push(product);
      }
    }

    return result;
  }, [
    featuredProducts,
    activeIndex,
    activeProduct,
  ]);

  const suggestions = useMemo(() => {
    const trimmedQuery =
      query.trim().toLowerCase();

    if (!trimmedQuery) {
      return [];
    }

    const categories = [
      "Books",
      "Electronics",
      "Lab Equipment",
      "Furniture",
      "Clothing",
      "Sports",
      "Accessories",
      "Other",
    ];

    const normalize = (value) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const queryWords = normalize(trimmedQuery)
      .split(" ")
      .filter(Boolean);

    const getSimilarityScore = (
      first,
      second
    ) => {
      const a = normalize(first);
      const b = normalize(second);

      if (a === b) {
        return 100;
      }

      if (a.includes(b) || b.includes(a)) {
        return 80;
      }

      const bWords = b.split(" ");

      let matchedWords = 0;

      queryWords.forEach((queryWord) => {
        const matched = bWords.some((word) => {
          if (
            word.startsWith(queryWord) ||
            queryWord.startsWith(word)
          ) {
            return true;
          }

          if (
            queryWord.length >= 4 &&
            word.length >= 4
          ) {
            let differences = 0;

            const maxLength = Math.max(
              queryWord.length,
              word.length
            );

            for (
              let index = 0;
              index < maxLength;
              index++
            ) {
              if (
                queryWord[index] !==
                word[index]
              ) {
                differences++;
              }
            }

            return differences <= 1;
          }

          return false;
        });

        if (matched) {
          matchedWords++;
        }
      });

      if (
        queryWords.length > 0 &&
        matchedWords === queryWords.length
      ) {
        return 70;
      }

      if (
        queryWords.length > 0 &&
        matchedWords > 0
      ) {
        return 45;
      }

      return 0;
    };

    const categorySuggestions = categories
      .map((category) => ({
        type: "category",
        label: category,
        category,
        score: getSimilarityScore(
          trimmedQuery,
          category
        ),
      }))
      .filter((item) => item.score > 0);

    const productSuggestions = products
      .map((product) => ({
        type: "product",
        label: product.name,
        category: product.category,
        productId: product.id,
        score: Math.max(
          getSimilarityScore(
            trimmedQuery,
            product.name
          ),
          getSimilarityScore(
            trimmedQuery,
            product.category
          )
        ),
      }))
      .filter((item) => item.score > 0);

    const combined = [
      ...categorySuggestions,
      ...productSuggestions,
    ];

    const unique = [];

    combined
      .sort((a, b) => b.score - a.score)
      .forEach((item) => {
        const alreadyExists = unique.some(
          (existing) =>
            existing.type === item.type &&
            existing.label === item.label
        );

        if (!alreadyExists) {
          unique.push(item);
        }
      });

    return unique.slice(0, 6);
  }, [query, products]);

  const handleSubmit = (event) => {
    event.preventDefault();

    setShowSuggestions(false);

    onSearch(query);
  };

  const handleCategorySearch = (category) => {
    setQuery(category);
    setShowSuggestions(false);

    onCategorySelect(category);
  };

  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);

    if (suggestion.type === "category") {
      setQuery(suggestion.category);
      onCategorySelect(suggestion.category);
      return;
    }

    setQuery(suggestion.label);
    onSearch(suggestion.label);
  };

  const handleHeroFavorite = (
    event,
    productId
  ) => {
    event.preventDefault();
    event.stopPropagation();

    onToggleFavorite(productId);
  };

  if (!activeProduct) {
    return null;
  }

  const isActiveFavorite = favorites.includes(
    activeProduct.id
  );

  const activeProductInitial =
    activeProduct.name
      ?.charAt(0)
      ?.toUpperCase() || "C";

  return (
    <section className="relative overflow-hidden bg-transparent transition-colors duration-500">
      {/* LIGHT MODE — ICY BLUE + SUBTLE NAVY REFLECTION */}
      {!isDark && (
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {/* Upper-right icy blue reflection */}
          <div
            className="absolute -right-[18%] -top-[28%] h-[700px] w-[700px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(147,197,253,0.18) 0%, rgba(191,219,254,0.10) 32%, rgba(255,255,255,0) 70%)",
              filter: "blur(38px)",
            }}
          />

          {/* Left-side cool blue reflection */}
          <div
            className="absolute -left-[20%] top-[20%] h-[600px] w-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.10) 0%, rgba(96,165,250,0.055) 35%, rgba(255,255,255,0) 72%)",
              filter: "blur(48px)",
            }}
          />

          {/* Very subtle indigo brand reflection */}
          <div
            className="absolute left-[42%] top-[5%] h-[420px] w-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.055) 0%, rgba(255,255,255,0) 72%)",
              filter: "blur(32px)",
            }}
          />

          {/* Premium glossy reflection streak */}
          <div
            className="absolute -left-[10%] top-[18%] h-[180px] w-[125%] rotate-[-8deg]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.78) 46%, rgba(191,219,254,0.12) 54%, rgba(255,255,255,0) 72%)",
              filter: "blur(18px)",
              opacity: 0.85,
            }}
          />

          {/* Subtle navy reflection at bottom */}
          <div
            className="absolute -bottom-[25%] left-[25%] h-[400px] w-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(15,23,42,0.055) 0%, rgba(30,64,175,0.035) 38%, rgba(255,255,255,0) 72%)",
              filter: "blur(42px)",
            }}
          />
        </div>
      )}

      {/* DARK MODE AMBIENT GLOW */}
      {isDark && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-indigo-950/50 blur-3xl" />

          <div className="absolute -left-48 top-[42%] h-[28rem] w-[28rem] rounded-full bg-slate-900 blur-3xl" />

          <div className="absolute right-[34%] top-[12%] h-32 w-32 rounded-full bg-indigo-950/40 blur-2xl" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-9">
        <div className="grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
          {/* LEFT CONTENT */}
          <div className="relative z-10">
            <div
              className={`mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-sm ${
                isDark
                  ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
                  : "border-indigo-100 bg-white/75 text-indigo-700 backdrop-blur-md"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                <Sparkles
                  size={11}
                  strokeWidth={2.5}
                />
              </span>

              Built for campus life
            </div>

            <h1
              className={`max-w-2xl text-5xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem] ${
                isDark
                  ? "text-white"
                  : "text-slate-950"
              }`}
            >
              Find what
              <br />
              you{" "}
              <span className="text-indigo-500">
                need.
              </span>
              <br />
              <span
                className={
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }
              >
                Sell what you
              </span>
              <br />
              <span
                className={
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }
              >
                don't.
              </span>
            </h1>

            <p
              className={`mt-7 max-w-xl text-base leading-7 sm:text-lg sm:leading-8 ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              A student-first marketplace for books,
              electronics, lab equipment, furniture, and
              everything else campus life demands.
            </p>

            {/* SEARCH */}
            <form
              onSubmit={handleSubmit}
              className="relative mt-8 max-w-2xl"
            >
              <div
                className={`flex items-center rounded-2xl border p-1.5 transition-all duration-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 ${
                  isDark
                    ? "border-slate-700 bg-slate-900 shadow-[0_16px_45px_rgba(0,0,0,0.25)]"
                    : "border-slate-200 bg-white/90 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-md"
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                  <Search
                    size={20}
                    className={
                      isDark
                        ? "shrink-0 text-slate-500"
                        : "shrink-0 text-slate-400"
                    }
                  />

                  <input
                    type="text"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setShowSuggestions(
                        event.target.value.trim()
                          .length > 0
                      );
                    }}
                    onFocus={() => {
                      if (query.trim()) {
                        setShowSuggestions(true);
                      }
                    }}
                    placeholder="Search books, electronics, lab equipment..."
                    className={`w-full min-w-0 bg-transparent py-3 text-sm outline-none sm:text-base ${
                      isDark
                        ? "text-white placeholder:text-slate-500"
                        : "text-slate-900 placeholder:text-slate-400"
                    }`}
                    aria-label="Search marketplace"
                    autoComplete="off"
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setShowSuggestions(false);
                      }}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isDark
                          ? "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
                          : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      }`}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-md"
                >
                  Search
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* SUGGESTIONS */}
              {showSuggestions &&
                suggestions.length > 0 && (
                  <div
                    className={`absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border p-2 shadow-[0_20px_50px_rgba(15,23,42,0.14)] ${
                      isDark
                        ? "border-slate-700 bg-slate-900"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <p
                      className={`px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                        isDark
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      Suggestions
                    </p>

                    <div className="space-y-1">
                      {suggestions.map(
                        (suggestion) => (
                          <button
                            key={`${suggestion.type}-${suggestion.label}`}
                            type="button"
                            onClick={() =>
                              handleSuggestionClick(
                                suggestion
                              )
                            }
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                              isDark
                                ? "hover:bg-slate-800"
                                : "hover:bg-indigo-50"
                            }`}
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                              <Search size={16} />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span
                                className={`block truncate text-sm font-semibold ${
                                  isDark
                                    ? "text-slate-100"
                                    : "text-slate-900"
                                }`}
                              >
                                {suggestion.label}
                              </span>

                              <span
                                className={`mt-0.5 block text-xs ${
                                  isDark
                                    ? "text-slate-500"
                                    : "text-slate-400"
                                }`}
                              >
                                {suggestion.type ===
                                "category"
                                  ? "Category"
                                  : suggestion.category}
                              </span>
                            </span>

                            <ArrowRight
                              size={15}
                              className={
                                isDark
                                  ? "shrink-0 text-slate-600"
                                  : "shrink-0 text-slate-300"
                              }
                            />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

              {showSuggestions &&
                query.trim() &&
                suggestions.length === 0 && (
                  <div
                    className={`absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border px-4 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.12)] ${
                      isDark
                        ? "border-slate-700 bg-slate-900"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        isDark
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      No suggestions found
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        isDark
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      Try a product name or category.
                    </p>
                  </div>
                )}
            </form>

            {/* POPULAR */}
            <div
              id="categories"
              className="mt-5 flex flex-wrap items-center gap-2"
            >
              <span
                className={`mr-1 text-xs font-semibold ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Popular:
              </span>

              {[
                "Books",
                "Electronics",
                "Lab Equipment",
                "Furniture",
              ].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    handleCategorySearch(category)
                  }
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${
                    isDark
                      ? "border-slate-700 bg-slate-900 text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300"
                      : "border-slate-200 bg-white/80 text-slate-600 backdrop-blur-md hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FEATURED PRODUCT */}
          <div className="relative mx-auto h-[450px] w-full max-w-[680px] sm:h-[500px] lg:h-[520px]">
            <div
              className={`absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[420px] sm:w-[420px] ${
                isDark
                  ? "bg-indigo-950/60"
                  : "bg-blue-100/55"
              }`}
            />

            <div
              className={`absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border sm:h-[420px] sm:w-[420px] lg:h-[450px] lg:w-[450px] ${
                isDark
                  ? "border-slate-700 bg-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
                  : "border-slate-200 bg-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.16)]"
              }`}
            >
              <Link
                to={`/product/${activeProduct.id}`}
                className="group block h-full w-full"
              >
                <img
                  key={activeProduct.id}
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
              </Link>

              <div
                className={`absolute bottom-4 left-4 right-4 rounded-2xl border p-3.5 shadow-xl backdrop-blur-xl sm:p-4 ${
                  isDark
                    ? "border-slate-700 bg-slate-900/95"
                    : "border-white/70 bg-white/92"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to={`/product/${activeProduct.id}`}
                    className="min-w-0"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                      {activeProduct.category}
                    </p>

                    <p
                      className={`mt-1 truncate text-sm font-bold sm:text-[15px] ${
                        isDark
                          ? "text-white"
                          : "text-slate-950"
                      }`}
                    >
                      {activeProduct.name}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className={`text-base font-bold ${
                          isDark
                            ? "text-white"
                            : "text-slate-950"
                        }`}
                      >
                        ₹
                        {activeProduct.price.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      <span
                        className={`text-[10px] font-medium ${
                          isDark
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        {activeProduct.condition}
                      </span>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={(event) =>
                      handleHeroFavorite(
                        event,
                        activeProduct.id
                      )
                    }
                    aria-label={
                      isActiveFavorite
                        ? "Remove from favourites"
                        : "Add to favourites"
                    }
                    aria-pressed={isActiveFavorite}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-200 hover:scale-105 ${
                      isActiveFavorite
                        ? "border-red-100 bg-red-50 text-red-500"
                        : isDark
                        ? "border-slate-700 bg-slate-800 text-slate-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                        : "border-slate-200 bg-white text-slate-500 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      size={18}
                      fill={
                        isActiveFavorite
                          ? "currentColor"
                          : "none"
                      }
                      strokeWidth={2}
                    />
                  </button>
                </div>

                <div
                  className={`mt-3 flex items-center gap-2 border-t pt-3 ${
                    isDark
                      ? "border-slate-700"
                      : "border-slate-100"
                  }`}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[9px] font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {activeProductInitial}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`truncate text-[10px] font-semibold ${
                        isDark
                          ? "text-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      {activeProduct.seller?.name ||
                        "Campus seller"}
                    </p>

                    <div
                      className={`mt-0.5 flex items-center gap-1 text-[10px] ${
                        isDark
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      <MapPin size={10} />

                      <span className="truncate">
                        {activeProduct.seller?.location ||
                          "Campus"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING PRODUCT 1 */}
            {floatingProducts[0] && (
              <Link
                to={`/product/${floatingProducts[0].id}`}
                className={`absolute left-0 top-8 z-20 hidden w-40 overflow-hidden rounded-2xl border shadow-[0_20px_50px_rgba(15,23,42,0.14)] transition-all duration-500 hover:-translate-y-2 sm:block sm:w-44 ${
                  isDark
                    ? "border-slate-700 bg-slate-900 hover:shadow-[0_25px_60px_rgba(79,70,229,0.18)]"
                    : "border-slate-200 bg-white/95 backdrop-blur-md hover:shadow-[0_25px_60px_rgba(79,70,229,0.14)]"
                }`}
              >
                <div
                  className={`relative h-28 overflow-hidden ${
                    isDark
                      ? "bg-slate-800"
                      : "bg-slate-100"
                  }`}
                >
                  <img
                    src={floatingProducts[0].image}
                    alt={floatingProducts[0].name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />

                  <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm">
                    <Heart
                      size={14}
                      className={
                        favorites.includes(
                          floatingProducts[0].id
                        )
                          ? "text-red-500"
                          : "text-slate-400"
                      }
                      fill={
                        favorites.includes(
                          floatingProducts[0].id
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </div>
                </div>

                <div className="p-3">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-indigo-500">
                    {floatingProducts[0].category}
                  </p>

                  <p
                    className={`mt-1 truncate text-xs font-bold ${
                      isDark
                        ? "text-white"
                        : "text-slate-900"
                    }`}
                  >
                    {floatingProducts[0].name}
                  </p>

                  <p
                    className={`mt-1 text-sm font-bold ${
                      isDark
                        ? "text-slate-200"
                        : "text-slate-950"
                    }`}
                  >
                    ₹
                    {floatingProducts[0].price.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </Link>
            )}

            {/* FLOATING PRODUCT 2 */}
            {floatingProducts[1] && (
              <Link
                to={`/product/${floatingProducts[1].id}`}
                className={`absolute right-0 top-16 z-20 hidden w-40 overflow-hidden rounded-2xl border shadow-[0_20px_50px_rgba(15,23,42,0.14)] transition-all duration-500 hover:-translate-y-2 sm:block sm:w-44 ${
                  isDark
                    ? "border-slate-700 bg-slate-900 hover:shadow-[0_25px_60px_rgba(79,70,229,0.18)]"
                    : "border-slate-200 bg-white/95 backdrop-blur-md hover:shadow-[0_25px_60px_rgba(79,70,229,0.14)]"
                }`}
              >
                <div
                  className={`relative h-28 overflow-hidden ${
                    isDark
                      ? "bg-slate-800"
                      : "bg-slate-100"
                  }`}
                >
                  <img
                    src={floatingProducts[1].image}
                    alt={floatingProducts[1].name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />

                  <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm">
                    <Heart
                      size={14}
                      className={
                        favorites.includes(
                          floatingProducts[1].id
                        )
                          ? "text-red-500"
                          : "text-slate-400"
                      }
                      fill={
                        favorites.includes(
                          floatingProducts[1].id
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </div>
                </div>

                <div className="p-3">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-indigo-500">
                    {floatingProducts[1].category}
                  </p>

                  <p
                    className={`mt-1 truncate text-xs font-bold ${
                      isDark
                        ? "text-white"
                        : "text-slate-900"
                    }`}
                  >
                    {floatingProducts[1].name}
                  </p>

                  <p
                    className={`mt-1 text-sm font-bold ${
                      isDark
                        ? "text-slate-200"
                        : "text-slate-950"
                    }`}
                  >
                    ₹
                    {floatingProducts[1].price.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </Link>
            )}

            {/* FLOATING PRODUCT 3 */}
            {floatingProducts[2] && (
              <Link
                to={`/product/${floatingProducts[2].id}`}
                className={`absolute bottom-8 right-2 z-20 hidden w-40 overflow-hidden rounded-2xl border shadow-[0_20px_50px_rgba(15,23,42,0.14)] transition-all duration-500 hover:-translate-y-2 sm:block sm:w-44 ${
                  isDark
                    ? "border-slate-700 bg-slate-900 hover:shadow-[0_25px_60px_rgba(79,70,229,0.18)]"
                    : "border-slate-200 bg-white/95 backdrop-blur-md hover:shadow-[0_25px_60px_rgba(79,70,229,0.14)]"
                }`}
              >
                <div
                  className={`relative h-28 overflow-hidden ${
                    isDark
                      ? "bg-slate-800"
                      : "bg-slate-100"
                  }`}
                >
                  <img
                    src={floatingProducts[2].image}
                    alt={floatingProducts[2].name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />

                  <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm">
                    <Heart
                      size={14}
                      className={
                        favorites.includes(
                          floatingProducts[2].id
                        )
                          ? "text-red-500"
                          : "text-slate-400"
                      }
                      fill={
                        favorites.includes(
                          floatingProducts[2].id
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </div>
                </div>

                <div className="p-3">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-indigo-500">
                    {floatingProducts[2].category}
                  </p>

                  <p
                    className={`mt-1 truncate text-xs font-bold ${
                      isDark
                        ? "text-white"
                        : "text-slate-900"
                    }`}
                  >
                    {floatingProducts[2].name}
                  </p>

                  <p
                    className={`mt-1 text-sm font-bold ${
                      isDark
                        ? "text-slate-200"
                        : "text-slate-950"
                    }`}
                  >
                    ₹
                    {floatingProducts[2].price.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </Link>
            )}

            {/* CAROUSEL DOTS */}
            <div
              className={`absolute bottom-0 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full border px-3 py-2 shadow-sm backdrop-blur-md ${
                isDark
                  ? "border-slate-700 bg-slate-900/90"
                  : "border-slate-200 bg-white/90"
              }`}
            >
              {featuredProducts.map(
                (product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    aria-label={`Show ${product.name}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-6 bg-indigo-600"
                        : isDark
                        ? "w-1.5 bg-slate-600 hover:bg-indigo-400"
                        : "w-1.5 bg-slate-300 hover:bg-indigo-300"
                    }`}
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div
          className={`mt-12 max-w-3xl border-t pt-7 sm:mt-14 ${
            isDark
              ? "border-slate-800"
              : "border-slate-200"
          }`}
        >
          <div className="grid grid-cols-3">
            <div>
              <p
                className={`text-2xl font-bold tracking-tight sm:text-3xl ${
                  isDark
                    ? "text-white"
                    : "text-slate-950"
                }`}
              >
                {products.length}
              </p>

              <p
                className={`mt-1 text-xs font-medium sm:text-sm ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Active listings
              </p>
            </div>

            <div
              className={`border-l pl-5 sm:pl-8 ${
                isDark
                  ? "border-slate-800"
                  : "border-slate-200"
              }`}
            >
              <p
                className={`text-2xl font-bold tracking-tight sm:text-3xl ${
                  isDark
                    ? "text-white"
                    : "text-slate-950"
                }`}
              >
                {
                  new Set(
                    products.map(
                      (product) =>
                        product.category
                    )
                  ).size
                }
              </p>

              <p
                className={`mt-1 text-xs font-medium sm:text-sm ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Categories
              </p>
            </div>

            <div
              className={`border-l pl-5 sm:pl-8 ${
                isDark
                  ? "border-slate-800"
                  : "border-slate-200"
              }`}
            >
              <p
                className={`text-2xl font-bold tracking-tight sm:text-3xl ${
                  isDark
                    ? "text-white"
                    : "text-slate-950"
                }`}
              >
                {
                  products.filter((product) => {
                    const created = new Date(
                      product.createdAt
                    );

                    const now = new Date();

                    const difference =
                      now.getTime() -
                      created.getTime();

                    return (
                      difference >= 0 &&
                      difference <=
                        7 *
                          24 *
                          60 *
                          60 *
                          1000
                    );
                  }).length
                }
              </p>

              <p
                className={`mt-1 text-xs font-medium sm:text-sm ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Listed this week
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;