import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MarketplaceSection from "./components/MarketplaceSection";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Favorites from "./pages/Favorites";
import Sell from "./pages/Sell";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import StarField from "./components/StarField";
import useLocalStorage from "./hooks/useLocalStorage";
import { initialProducts as seedProducts } from "./data/products";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useLocalStorage(
    "campusmart-theme",
    "light"
  );

  const [products, setProducts] = useLocalStorage(
    "campusmart-products",
    seedProducts
  );

  const [favorites, setFavorites] = useLocalStorage(
    "campusmart-favorites",
    []
  );

  const [notifications, setNotifications] =
    useLocalStorage(
      "campusmart-stock-notifications",
      []
    );

  const [stockAlerts, setStockAlerts] = useState([]);
  const [activeStockAlert, setActiveStockAlert] =
    useState(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [searchVersion, setSearchVersion] =
    useState(0);

  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      isDark
    );

    document.documentElement.style.colorScheme =
      isDark ? "dark" : "light";
  }, [isDark]);

  const handleToggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark"
        ? "light"
        : "dark"
    );
  };

  useEffect(() => {
    setProducts((currentProducts) => {
      const currentMap = new Map(
        currentProducts.map((product) => [
          product.id,
          product,
        ])
      );

      const mergedProducts = seedProducts.map(
        (seedProduct) => {
          const existingProduct =
            currentMap.get(seedProduct.id);

          if (!existingProduct) {
            return seedProduct;
          }

          return {
            ...seedProduct,
            ...existingProduct,
            inStock:
              existingProduct.inStock === false
                ? false
                : seedProduct.inStock !== false,
          };
        }
      );

      const customProducts =
        currentProducts.filter(
          (product) =>
            !seedProducts.some(
              (seedProduct) =>
                seedProduct.id === product.id
            )
        );

      return [
        ...mergedProducts,
        ...customProducts,
      ];
    });
  }, [setProducts]);

  const handleToggleFavorite = (productId) => {
    setFavorites((currentFavorites) => {
      if (currentFavorites.includes(productId)) {
        return currentFavorites.filter(
          (id) => id !== productId
        );
      }

      return [
        ...currentFavorites,
        productId,
      ];
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchVersion((currentVersion) =>
      currentVersion + 1
    );

    setTimeout(() => {
      document
        .getElementById("marketplace")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  const handleCategorySelect = (category) => {
    setSearchQuery(category);
    setSearchVersion((currentVersion) =>
      currentVersion + 1
    );
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchVersion((currentVersion) =>
      currentVersion + 1
    );
  };

  const handleAddProduct = (product) => {
    const productWithDefaults = {
      ...product,
      ownerId:
        product.ownerId || "current-user",
      inStock:
        product.inStock !== false,
    };

    setProducts((currentProducts) => [
      productWithDefaults,
      ...currentProducts,
    ]);
  };

  const handleDeleteProduct = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) =>
          product.id !== productId
      )
    );

    setFavorites((currentFavorites) =>
      currentFavorites.filter(
        (id) => id !== productId
      )
    );

    setNotifications((currentNotifications) =>
      currentNotifications.filter(
        (id) => id !== productId
      )
    );

    setStockAlerts((currentAlerts) =>
      currentAlerts.filter(
        (alert) => alert.id !== productId
      )
    );
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((currentProducts) => {
      const previousProduct =
        currentProducts.find(
          (product) =>
            product.id === updatedProduct.id
        );

      if (
        previousProduct?.inStock === false &&
        updatedProduct.inStock !== false
      ) {
        try {
          const savedNotifications =
            localStorage.getItem(
              "campusmart-stock-notifications"
            );

          const notificationIds =
            savedNotifications
              ? JSON.parse(savedNotifications)
              : [];

          if (
            notificationIds.includes(
              updatedProduct.id
            )
          ) {
            setStockAlerts((currentAlerts) => {
              if (
                currentAlerts.some(
                  (alert) =>
                    alert.id ===
                    updatedProduct.id
                )
              ) {
                return currentAlerts;
              }

              return [
                ...currentAlerts,
                updatedProduct,
              ];
            });

            const remainingNotifications =
              notificationIds.filter(
                (id) =>
                  id !== updatedProduct.id
              );

            localStorage.setItem(
              "campusmart-stock-notifications",
              JSON.stringify(
                remainingNotifications
              )
            );

            setNotifications(
              remainingNotifications
            );
          }
        } catch (error) {
          console.error(
            "Unable to process stock notification:",
            error
          );
        }
      }

      return currentProducts.map(
        (product) =>
          product.id === updatedProduct.id
            ? updatedProduct
            : product
      );
    });
  };

  const handleNotifyAvailability = (
    productId
  ) => {
    setNotifications((currentNotifications) => {
      if (
        currentNotifications.includes(productId)
      ) {
        return currentNotifications;
      }

      return [
        ...currentNotifications,
        productId,
      ];
    });
  };

  const dismissStockAlert = (event) => {
    event.stopPropagation();

    if (!activeStockAlert) {
      return;
    }

    setStockAlerts((currentAlerts) =>
      currentAlerts.filter(
        (alert) =>
          alert.id !== activeStockAlert.id
      )
    );

    setActiveStockAlert(null);
  };

  const handleStockAlertClick = () => {
    if (!activeStockAlert) {
      return;
    }

    const productId = activeStockAlert.id;

    if (
      location.pathname ===
      `/product/${productId}`
    ) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setStockAlerts((currentAlerts) =>
        currentAlerts.filter(
          (alert) =>
            alert.id !== productId
        )
      );

      setActiveStockAlert(null);

      return;
    }

    const productCard = document.getElementById(
      `product-card-${productId}`
    );

    if (productCard) {
      productCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      productCard.classList.add(
        "ring-2",
        "ring-indigo-500",
        "ring-offset-4"
      );

      setTimeout(() => {
        productCard.classList.remove(
          "ring-2",
          "ring-indigo-500",
          "ring-offset-4"
        );
      }, 2500);

      setStockAlerts((currentAlerts) =>
        currentAlerts.filter(
          (alert) =>
            alert.id !== productId
        )
      );

      setActiveStockAlert(null);

      return;
    }

    setStockAlerts((currentAlerts) =>
      currentAlerts.filter(
        (alert) =>
          alert.id !== productId
      )
    );

    setActiveStockAlert(null);

    navigate(`/product/${productId}`);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, 100);
  };

  useEffect(() => {
    if (stockAlerts.length === 0) {
      setActiveStockAlert(null);
      return;
    }

    const latestAlert =
      stockAlerts[stockAlerts.length - 1];

    setActiveStockAlert(latestAlert);
  }, [stockAlerts]);

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${
        isDark
          ? "bg-slate-950 text-slate-100"
          : "bg-transparent text-slate-950"
      }`}
    >
      {isDark && (
        <div
          className="pointer-events-none fixed inset-0 z-[1]"
          aria-hidden="true"
        >
          <StarField isDark={true} />
        </div>
      )}

      <div className="relative z-[2]">
        <Navbar
          favorites={favorites}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {activeStockAlert && (
          <div className="fixed right-5 top-20 z-[100] w-[calc(100%-2.5rem)] max-w-sm">
            <div
              className={`relative overflow-hidden rounded-2xl border shadow-[0_20px_60px_rgba(15,23,42,0.18)] ${
                isDark
                  ? "border-indigo-500/20 bg-slate-900"
                  : "border-indigo-100 bg-white"
              }`}
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-indigo-600" />

              <div className="p-5">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={handleStockAlertClick}
                    className="min-w-0 flex-1 rounded-lg text-left outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
                      Back in stock
                    </p>

                    <p
                      className={`mt-1 text-sm font-semibold ${
                        isDark
                          ? "text-white"
                          : "text-slate-950"
                      }`}
                    >
                      {activeStockAlert.name}
                    </p>

                    <p
                      className={`mt-1 text-xs leading-5 ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      This item is available again.
                    </p>

                    <p className="mt-3 text-xs font-semibold text-indigo-600">
                      Click to view product →
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={dismissStockAlert}
                    aria-label="Dismiss notification"
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg font-medium transition-colors ${
                      isDark
                        ? "text-slate-500 hover:bg-slate-800 hover:text-white"
                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero
                  products={products}
                  favorites={favorites}
                  onToggleFavorite={
                    handleToggleFavorite
                  }
                  onSearch={handleSearch}
                  onCategorySelect={
                    handleCategorySelect
                  }
                  theme={theme}
                />

                <MarketplaceSection
                  products={products}
                  searchQuery={searchQuery}
                  searchVersion={searchVersion}
                  onClearSearch={handleClearSearch}
                  favorites={favorites}
                  onToggleFavorite={
                    handleToggleFavorite
                  }
                  notifications={notifications}
                  onNotifyAvailability={
                    handleNotifyAvailability
                  }
                />
              </>
            }
          />

          <Route
            path="/marketplace"
            element={
              <Marketplace
                products={products}
                favorites={favorites}
                onToggleFavorite={
                  handleToggleFavorite
                }
                notifications={notifications}
                onNotifyAvailability={
                  handleNotifyAvailability
                }
              />
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProductDetails
                products={products}
                favorites={favorites}
                onToggleFavorite={
                  handleToggleFavorite
                }
                notifications={notifications}
                onNotifyAvailability={
                  handleNotifyAvailability
                }
              />
            }
          />

          <Route
            path="/favorites"
            element={
              <Favorites
                products={products}
                favorites={favorites}
                onToggleFavorite={
                  handleToggleFavorite
                }
                notifications={notifications}
                onNotifyAvailability={
                  handleNotifyAvailability
                }
              />
            }
          />

          <Route
            path="/sell"
            element={
              <Sell
                onAddProduct={handleAddProduct}
              />
            }
          />

          <Route
            path="/my-listings"
            element={
              <MyListings
                products={products}
                onDeleteProduct={
                  handleDeleteProduct
                }
              />
            }
          />

          <Route
            path="/edit/:id"
            element={
              <EditListing
                products={products}
                onUpdateProduct={
                  handleUpdateProduct
                }
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;