import React, { useState, useRef, useEffect } from "react";
import ePub from "epubjs";
import "./Reader.css";  

const Library = ({ onBookSelect, books, onAddBook, onDeleteBook }) => {
  return (
    <div className="library-view">
      <div className="books-grid">
        {books.map((book, index) => (
          <div key={index} className="book-card relative">
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBook(index);
              }}
            >
              −
            </button>
            <div className="book-cover" onClick={() => onBookSelect(book)}>
              {book.cover ? (
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="no-cover">No Cover</div>
              )}
            </div>
            <div className="book-info">
              <h3>{book.title || "Untitled Book"}</h3>
              <p>{book.author || "Unknown Author"}</p>
            </div>
          </div>
        ))}
        <label className="add-book-card">
          <input
            type="file"
            onChange={onAddBook}
            className="hidden"
            accept=".epub"
          />
          <div className="add-book-content">
            <span>+</span>
            <p>Add New Book</p>
          </div>
        </label>
      </div>
    </div>
  );
};

function App() {
  const [book, setBook] = useState(null);
  const [rendition, setRendition] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [visibleMenu, setVisibleMenu] = useState("");
  const [toc, setToc] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showLibrary, setShowLibrary] = useState(true);
  const [books, setBooks] = useState([]);
  const [selectedBookData, setSelectedBookData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [font, setFont] = useState(localStorage.getItem("font") || "Helvetica");
  const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "18px");
  const [fontColor, setFontColor] = useState(localStorage.getItem("fontColor") || (theme === "dark" ? "white" : "black"));
  const viewerRef = useRef(null);

  useEffect(() => {
    const savedBooks = localStorage.getItem("books");
    if (savedBooks) {
      try {
        const parsedBooks = JSON.parse(savedBooks);
        const updatedBooks = parsedBooks.map(book => {
          
          if (!book.fileURL) {
            return null; 
          }
          return {
            ...book,
            fileURL: book.fileURL || URL.createObjectURL(new Blob([book.file], { type: 'application/epub+zip' }))
          };
        }).filter(Boolean); 

        setBooks(updatedBooks);
      } catch (error) {
        console.error("Error parsing saved books:", error);
        localStorage.removeItem("books"); 
      }
    }
  }, []);

  const extractCover = async (epubBook) => {
    try {
      const cover = await epubBook.loaded.cover;
      if (cover) {
        const coverUrl = await epubBook.archive.createUrl(cover, { base64: true });
        return coverUrl;
      }
      return null;
    } catch (error) {
      console.error("Error extracting cover:", error);
      return null;
    }
  };

  
  useEffect(() => {
    const loadBook = async () => {
      if (!showLibrary && selectedBookData && viewerRef.current) {
        try {
          const response = await fetch(selectedBookData.fileURL);
          const blob = await response.blob();
          const newBook = ePub(blob);

          
          await newBook.ready;

          const newRendition = newBook.renderTo(viewerRef.current, {
            width: "100%",
            height: "100%",
          });

          
          try {
            await newRendition.display();
          } catch (displayError) {
            console.error("Error displaying book:", displayError);
          }

          setBook(newBook);
          setRendition(newRendition);

          
          try {
            const navigation = await newBook.loaded.navigation;
            setToc(navigation.toc || []);
          } catch (tocError) {
            console.warn("Could not load table of contents:", tocError);
            setToc([]);
          }

          
          newRendition.on('locationChanged', (loc) => {
            setCurrentLocation(loc);
            if (selectedBookData && selectedBookData.fileName) {
              localStorage.setItem(`${selectedBookData.fileName}-location`, loc.start.cfi);
            }
          });

          
          if (selectedBookData && selectedBookData.fileName) {
            const savedLocation = localStorage.getItem(`${selectedBookData.fileName}-location`);
            if (savedLocation) {
              try {
                await newRendition.display(savedLocation);
              } catch (locationError) {
                console.warn("Could not display saved location:", locationError);
              }
            }
          }

          return () => {
            if (newRendition) {
              newRendition.destroy();
            }
          };

        } catch (error) {
          console.error("Comprehensive book loading error:", error);
          alert("Error loading book. Please ensure the EPUB file is valid and try again.");
        }
      }
    };

    loadBook();
  }, [showLibrary, selectedBookData]);

  
  useEffect(() => {
    if (rendition) {
      rendition.themes.register("light", {
        body: { background: "white", color: "black", fontFamily: font, fontSize: fontSize },
      });
      rendition.themes.register("dark", {
        body: { background: "black", color: "white", fontFamily: font, fontSize: fontSize },
      });
      rendition.themes.select(theme);

      const handleKeyDown = (event) => {
        if (event.key === "ArrowLeft") rendition.prev();
        if (event.key === "ArrowRight") rendition.next();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [theme, rendition, font, fontSize]);

  // Book search functionality
  const searchBook = async () => {
    if (!book || !searchQuery) {
      console.log("Search aborted: No book or empty query");
      return;
    }

    setSearchResults([]);
    const results = [];

    try {
      const spine = await book.loaded.spine;
      console.log(`Total spine items: ${spine.items.length}`);

      const searchPromises = spine.items.map(async (item, index) => {
        try {
          console.log(`Loading spine item ${index}: ${item.href}`);

          const doc = await item.load(book.load.bind(book));

          
          const textContent = doc?.body?.textContent || "";
          if (!textContent) {
            console.warn(`No text content for spine item ${index}`);
            return null;
          }

          console.log(`Text length for item ${index}: ${textContent.length}`);

          
          const regex = new RegExp(searchQuery, "gi");
          const matches = [...textContent.matchAll(regex)];

          if (matches.length > 0) {
            console.log(`Found ${matches.length} matches in spine item ${index}`);

            
            matches.forEach((match, matchIndex) => {
              const startOffset = match.index;
              const endOffset = startOffset + match[0].length;

              
              const cfi = item.cfiFromText(startOffset, endOffset);
              const excerpt = textContent.substring(
                Math.max(0, startOffset - 40),
                Math.min(textContent.length, endOffset + 40)
              ).trim();

              results.push({
                cfi: cfi,
                href: item.href,
                matches: 1,
                excerpt: excerpt,
              });
            });
          }
        } catch (error) {
          console.error(`Error processing spine item ${index}:`, error);
        }
        return null;
      });

      await Promise.all(searchPromises);

      console.log(`Total search results: ${results.length}`);
      setSearchResults(results);

      if (results.length > 0 && rendition) {
        try {
          console.log(`Displaying first result CFI: ${results[0].cfi}`);
          await rendition.display(results[0].cfi);
          highlightSearchResults();
        } catch (displayError) {
          console.error("Error displaying first search result:", displayError);
        }
      } else {
        alert("No results found.");
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const highlightSearchResults = () => {
    if (!rendition || !searchResults) return;

    try {
      searchResults.forEach((result) => {
        console.log(`Highlighting CFI: ${result.cfi}`);
        rendition.annotations.highlight(
          result.cfi,
          {},
          () => {},
          "search-highlight",
          {
            fill: "yellow",
            "fill-opacity": "0.5",
          }
        );
      });
    } catch (error) {
      console.error("Highlighting error:", error);
    }
  };

 
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const newBook = ePub(file);
        const metadata = await newBook.loaded.metadata;
        const cover = await extractCover(newBook);

        const newBookData = {
          fileURL: URL.createObjectURL(file),
          title: metadata.title || file.name,
          author: metadata.creator || "Unknown Author",
          fileName: file.name,
          dateAdded: new Date().toISOString(),
          cover: cover,
          file: await file.arrayBuffer() 
        };

        const updatedBooks = [...books, newBookData];
        setBooks(updatedBooks);
        localStorage.setItem("books", JSON.stringify(updatedBooks));
        openBook(newBookData);
      } catch (error) {
        console.error("Error loading book:", error);
        alert("Error loading book. Please try another file.");
      }
    }
  };

  
  const openBook = (bookData) => {
    setSelectedBookData(bookData);
    setShowLibrary(false);
  };

  
  const deleteBook = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
  };

  
  const navigateToResult = (cfi) => {
    if (rendition && cfi) {
      rendition.display(cfi).then(highlightSearchResults);
    }
  };

  
  const toggleMenu = (menu) => {
    setVisibleMenu((prevMenu) => (prevMenu === menu ? "" : menu));
  };

  
  const changeFont = (newFont) => {
    setFont(newFont);
    localStorage.setItem("font", newFont);
    if (rendition) {
      rendition.themes.font(newFont);
    }
  };

  
  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    if (rendition) {
      rendition.themes.fontSize(size);
    }
  };

  // Change font color
  const changeFontColor = (newColor) => {
    setFontColor(newColor);
    localStorage.setItem("fontColor", newColor);
    if (rendition) {
      rendition.themes.default({
        body: { color: newColor }
      });
    }
  };

  
  const incrementFontSize = (amount) => {
    const newSize = parseInt(fontSize, 10) + amount;
    changeFontSize(`${newSize}px`);
  };

  
  const returnToLibrary = () => {
    if (rendition) {
      rendition.destroy();
    }
    setBook(null);
    setRendition(null);
    setSelectedBookData(null);
    setShowLibrary(true);
  };

  
  const switchTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = `${newTheme}-mode`;
    changeFontColor(newTheme === "dark" ? "white" : "black");
  };

  // AI Summarizer function (placeholder)
    const generateSummary = async () => {
      if (!book) return;
  
      try {
        const currentChapter = await book.spine.get(currentLocation.start.cfi);
        const content = await currentChapter.load();
        const text = content?.body?.textContent || "";
  

        console.log("Generating summary for:", text.substring(0, 1000));
  
        const summary = `Summary of the current chapter: ${text.substring(0, 100)}`;
        alert("AI Summary: " + summary);
      } catch (error) {
        console.error("Error generating summary:", error);
        alert("Error generating summary. Please try again later.");
      }
    };
  

    const sidebarStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };
  

    const tocButtonStyle = {
      width: "100%",
      padding: "10px",
      margin: "5px 0",
      background: "#444",
      color: "white",
      fontSize: "14px",
      textAlign: "center",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease, transform 0.3s ease",
    };
  
    const tocButtonHoverStyle = {
      backgroundColor: "#666",
      transform: "scale(1.05)",
    };
  
    return (
      <div className={`app ${theme}-mode`} style={{ fontFamily: "Times New Roman", color: fontColor }}>
        <div className="prime-sidebar" style={sidebarStyle}>
          <button className="sb" onClick={returnToLibrary}>
            <img src="home.png" alt="Home" />
          </button>
          <button className="sb" onClick={() => toggleMenu("fonts")}>
            <img src="font.png" alt="Fonts" />
          </button>
          <button className="sb" onClick={() => toggleMenu("toc")}>
            <img src="toc.png" alt="TOC" />
          </button>
          <button className="sb" onClick={() => toggleMenu("settings")}>
            <img src="settings.png" alt="Settings" />
          </button>
          <button className="sb" onClick={() => switchTheme("light")}>
            <img src="light.png" alt="Light Mode" />
          </button>
          <button className="sb" onClick={() => switchTheme("dark")}>
            <img src="dark.png" alt="Dark Mode" />
          </button>
          <button className="sb" onClick={() => toggleMenu("search")}>
            <img src="search.png" alt="Search" />
          </button>
          <button className="sb" onClick={generateSummary}>
            <img src="summariser.png" alt="AI Summarizer" />
          </button>
        </div>
  
        <div className="menu-sidebar">
        {visibleMenu === "fonts" && (
  <div className="menu visible">
    <h4>Font Settings</h4>
    <select onChange={(e) => changeFont(e.target.value)} value={font}>
      <option value="Helvetica">Helvetica</option>
      <option value="Arial">Arial</option>
      <option value="Georgia">Georgia</option>
      <option value="Times New Roman">Times New Roman</option>
      <option value="Verdana">Verdana</option>
    </select>
    <div className="font-size-control">
      <h5>Font Size</h5>
      <div className="control-buttons">
        <button onClick={() => incrementFontSize(-1)}>−</button>
        <input
          type="number"
          value={parseInt(fontSize, 10)}
          onChange={(e) => changeFontSize(`${e.target.value}px`)}
          min="10"
          max="100"
        />
        <button onClick={() => incrementFontSize(1)}>+</button>
      </div>
    </div>
  </div>
)}
          {visibleMenu === "search" && (
            <div className="menu visible">
              <h4>Search</h4>
              <div className="search-container">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search in current book..."
    className="search-input"
    onKeyPress={(e) => e.key === 'Enter' && searchBook()}
  />
  <button 
    onClick={searchBook} 
    disabled={!searchQuery}
    className="search-button"
  >
    Search
  </button>
</div>
              {searchResults.length > 0 && (
                <div className="search-results">
                  <h5>Found {searchResults.length} results:</h5>
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => navigateToResult(result.cfi)}
                      className="search-result-item"
                    >
                      <div className="result-number">Result {index + 1}</div>
                      <div className="result-excerpt">{result.excerpt}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {visibleMenu === "settings" && (
            <div className="menu visible">
              <h4>Settings</h4>
              <div className="settings-options">
                <label>
                  <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={(e) => switchTheme(e.target.checked ? "dark" : "light")}
                  />
                  Dark Mode
                </label>
              </div>
            </div>
          )}
          {visibleMenu === "toc" && (
            <div className="menu visible">
              <h4>Table of Contents</h4>
              {toc.map((item, index) => (
                <button
                  key={index}
                  style={tocButtonStyle}
                  onClick={() => navigateToResult(item.href)}
                  onMouseEnter={(e) => e.target.style.transform = tocButtonHoverStyle.transform}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
  
        {showLibrary ? (
          <Library
            onBookSelect={openBook}
            books={books}
            onAddBook={handleFileChange}
            onDeleteBook={deleteBook}
          />
        ) : (
          <div className="viewer" ref={viewerRef} style={{ fontFamily: font, fontSize: fontSize }}>
          </div>
        )}
      </div>
    );
  }
  
  export default App;