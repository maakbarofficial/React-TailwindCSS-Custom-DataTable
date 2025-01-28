import React, { useState, useMemo, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import {
    IoCaretDownOutline,
    IoCaretUpOutline,
    IoChevronBackOutline,
    IoChevronForwardOutline,
    IoDownloadOutline,
    IoSearchOutline,
    IoTrashOutline,
} from "react-icons/io5";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { TbFileExport } from "react-icons/tb";
import { IoMdCopy } from "react-icons/io";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DataTable = ({
    data,
    searchBar = false,
    excelExport = false,
    pdfExport = true,
    csvExport = true,
    pagination = false,
    removableRows = false,
    pageSizeControl = false,
    removableColumns = false,
    copyRows = true,
}) => {
    const columns = Object.keys(data);
    const rowCount = Math.max(
        ...columns.map((column) => data[column].values.length)
    );

    const removableColumnsDropdownRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [sortConfig, setSortConfig] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [isRemovableColumnsDropdownOpen, setIsRemovableColumnsDropdownOpen] =
        useState(false);

    const [columnVisibility, setColumnVisibility] = useState(
        columns.reduce((acc, column) => {
            acc[column] = true; // All columns are visible by default
            return acc;
        }, {})
    );

    const handleColumnVisibilityChange = (column) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [column]: !prev[column], // Toggle the visibility
        }));
    };

    const handleClickOutsideRemovableColumnsDropdown = (event) => {
        if (
            removableColumnsDropdownRef.current &&
            !removableColumnsDropdownRef.current.contains(event.target)
        ) {
            setIsRemovableColumnsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener(
            "mousedown",
            handleClickOutsideRemovableColumnsDropdown
        );
        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutsideRemovableColumnsDropdown
            );
        };
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    const handleSort = (accessor) => {
        let direction = "asc";
        if (sortConfig && sortConfig.key === accessor) {
            if (sortConfig.direction === "asc") {
                direction = "desc";
            } else if (sortConfig.direction === "desc") {
                direction = null;
            }
        }
        setSortConfig({ key: accessor, direction });
    };

    const handleCopyRows = () => {
        // Use sortedRows instead of rows
        const rowsToCopy = selectedRows.length === 0 ? sortedRows : selectedRows.map(rowIndex => sortedRows[parseInt(rowIndex, 10)]);

        // Convert rows to a format suitable for copying, excluding hidden columns
        const textToCopy = rowsToCopy.map(row => {
            return columns
                .filter(column => columnVisibility[column]) // Only include visible columns
                .map(column => row[column]) // Get the value for each visible column
                .join("\t"); // Join values with tab for better formatting
        }).join("\n"); // Join rows with newline

        // Copy to clipboard
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast.success("Copied to clipboard");
        }).catch(err => {
            toast.error("Failed to copy: ", err);
        });
    };

    const exportToExcel = () => {
        // Determine which rows to export
        const rowsToExport = selectedRows.length > 0
            ? selectedRows.map(rowIndex => sortedRows[parseInt(rowIndex, 10)])
            : sortedRows;

        // Determine which columns to export (only visible columns)
        const visibleColumns = columns.filter(column => columnVisibility[column]);

        // Prepare the data for export
        const exportData = rowsToExport.map((row) => {
            const exportRow = {};
            visibleColumns.forEach((column) => {
                exportRow[column] = row[column] || "FALSE"; // Use "FALSE" for empty values
            });
            return exportRow;
        });

        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Export the file
        XLSX.writeFile(workbook, "data.xlsx");
    };

    const exportToCSV = () => {
        // Determine which rows to export
        const rowsToExport = selectedRows.length > 0
            ? selectedRows.map(rowIndex => sortedRows[parseInt(rowIndex, 10)])
            : sortedRows;

        // Determine which columns to export (only visible columns)
        const visibleColumns = columns.filter(column => columnVisibility[column]);

        // Prepare the data for export
        const exportData = rowsToExport.map((row) => {
            const exportRow = {};
            visibleColumns.forEach((column) => {
                exportRow[column] = row[column] || ""; // Use empty string for empty values
            });
            return exportRow;
        });

        // Convert the data to CSV format
        const csvContent = [
            visibleColumns.join(","), // Header row
            ...exportData.map(row => visibleColumns.map(column => row[column]).join(",")) // Data rows
        ].join("\n");

        // Create a Blob and trigger a download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "data.csv";
        link.click();
    };

    const exportToPDF = () => {
        // Determine which rows to export
        const rowsToExport = selectedRows.length > 0
            ? selectedRows.map(rowIndex => sortedRows[parseInt(rowIndex, 10)])
            : sortedRows;

        // Determine which columns to export (only visible columns)
        const visibleColumns = columns.filter(column => columnVisibility[column]);

        // Prepare the data for export
        const exportData = rowsToExport.map((row) => {
            return visibleColumns.map(column => row[column] || ""); // Use empty string for empty values
        });

        // Create a new PDF document
        const doc = new jsPDF({
            orientation: 'landscape', // Set to landscape if the table is too wide
            unit: 'mm',
            format: 'a4'
        });

        // Add a title to the PDF
        doc.setFontSize(18);
        doc.text("Data Table Export", 14, 15);

        // Generate the table using jspdf-autotable
        doc.autoTable({
            head: [visibleColumns], // Header row
            body: exportData, // Data rows
            startY: 20, // Start position below the title
            margin: { top: 20, right: 10, bottom: 10, left: 10 }, // Set margins
            styles: {
                fontSize: 6, // Set font size
                cellPadding: 2, // Set cell padding
                overflow: 'linebreak', // Handle overflow
                valign: 'middle', // Vertical alignment
                halign: 'center', // Horizontal alignment
            },
            headStyles: {
                fillColor: [41, 128, 185], // Header background color
                textColor: [255, 255, 255], // Header text color
                fontStyle: 'bold', // Header font style
            },
            bodyStyles: {
                fillColor: [245, 245, 245], // Body background color
                textColor: [0, 0, 0], // Body text color
            },
            columnStyles: {
                0: { cellWidth: 'auto' }, // Adjust column widths as needed
                1: { cellWidth: 'auto' },
                // Add more columns as needed
            },
        });

        // Save the PDF
        doc.save("data.pdf");
    };

    const handleRowSelect = (rowIndex) => {
        const selectedRowIndex = selectedRows.indexOf(String(rowIndex));
        if (selectedRowIndex === -1) {
            setSelectedRows([...selectedRows, String(rowIndex)]);
        } else {
            const updatedSelectedRows = [...selectedRows];
            updatedSelectedRows.splice(selectedRowIndex, 1);
            setSelectedRows(updatedSelectedRows);
        }
    };

    const handleDeleteSelectedRows = () => {
        const updatedData = { ...data };
        selectedRows.forEach((rowIndexString) => {
            const rowIndex = parseInt(rowIndexString, 10);
            columns.forEach((column) => {
                updatedData[column].values.splice(rowIndex, 1);
            });
        });
        setSelectedRows([]);
    };

    const rows = useMemo(() => {
        return Array.from({ length: rowCount }, (_, index) => {
            return columns.reduce((acc, column) => {
                acc[column] = data[column].values[index] || "";
                return acc;
            }, {});
        });
    }, [data, columns, rowCount]);

    const sortedRows = useMemo(() => {
        if (!sortConfig || !sortConfig.direction) return rows;

        return [...rows].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [rows, sortConfig]);

    const filteredRows = useMemo(() => {
        return sortedRows.filter((row) =>
            columns.some((column) =>
                String(row[column]).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [sortedRows, searchTerm, columns]);

    const paginatedRows = useMemo(() => {
        const start = currentPage * pageSize;
        return filteredRows.slice(start, start + pageSize);
    }, [filteredRows, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredRows.length / pageSize);

    return (
        <div className="max-w-full overflow-x-auto py-5">
            <div className="flex w-full items-center justify-between mb-5">
                {searchBar ? (
                    <div className="max-w-sm">
                        <label
                            htmlFor="default-search"
                            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                        >
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <IoSearchOutline />
                            </div>
                            <input
                                value={searchTerm}
                                onChange={handleSearch}
                                type="search"
                                id="default-search"
                                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search..."
                                required=""
                            />
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}

                <div className="flex items-center gap-5">
                    {removableColumns && (
                        <div
                            className="relative inline-block"
                            ref={removableColumnsDropdownRef}
                        >
                            <button
                                onClick={() =>
                                    setIsRemovableColumnsDropdownOpen(
                                        !isRemovableColumnsDropdownOpen
                                    )
                                }
                                className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                type="button"
                            >
                                Columns Control
                                <div className="w-2.5 h-2.5 ms-3">
                                    {isRemovableColumnsDropdownOpen ? (
                                        <FaChevronUp size={10} />
                                    ) : (
                                        <FaChevronDown size={10} />
                                    )}
                                </div>
                            </button>

                            {/* Dropdown menu */}
                            {isRemovableColumnsDropdownOpen && (
                                <div
                                    className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600 w-max"
                                    style={{ top: "100%", left: 0 }}
                                >
                                    <ul className="p-3 space-y-1 text-xs text-gray-700 dark:text-gray-200 grid grid-cols-2 gap-x-4">
                                        {columns.map((column, index) => (
                                            <li key={index}>
                                                <div className="flex p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                                                    <div className="flex items-center h-5">
                                                        <input
                                                            type="checkbox"
                                                            checked={columnVisibility[column]}
                                                            onChange={() =>
                                                                handleColumnVisibilityChange(column)
                                                            }
                                                            className="cursor-pointer w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                        />
                                                    </div>
                                                    <div className="ms-2 text-xs">
                                                        <label className="font-medium text-gray-900 dark:text-gray-300">
                                                            <div>{column}</div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    {copyRows && (
                        <button
                            onClick={handleCopyRows}
                            className="cursor-pointer flex justify-center items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Copy
                            <IoMdCopy />
                        </button>
                    )}
                    {excelExport && (
                        <button
                            onClick={exportToExcel}
                            className="cursor-pointer flex justify-center items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            XLSX
                            <TbFileExport />
                        </button>
                    )}
                    {pdfExport && (
                        <button
                            onClick={exportToPDF}
                            className="cursor-pointer flex justify-center items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            PDF
                            <IoDownloadOutline />
                        </button>
                    )}
                    {csvExport && (
                        <button
                            onClick={exportToCSV}
                            className="cursor-pointer flex justify-center items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            CSV
                            <TbFileExport />
                        </button>
                    )}
                    {removableRows && (
                        <button
                            onClick={handleDeleteSelectedRows}
                            disabled={selectedRows.length === 0}
                            className="cursor-pointer flex justify-center items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Delete
                            <IoTrashOutline
                                className={`${selectedRows.length === 0
                                    ? "cursor-default"
                                    : "cursor-pointer text-red-200"
                                    }`}
                            />
                        </button>
                    )}
                </div>
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-gray-700 Capatalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="hidden px-6 py-3" scope="col">
                                Actions
                            </th>
                            {/* Index Column (Can be used for Testing) */}
                            {/* <th className="font-medium text-gray-300 text-[16px] pl-5">#</th> */}
                            {columns.map(
                                (column, index) =>
                                    columnVisibility[column] && (
                                        <th
                                            key={index}
                                            onClick={() => handleSort(column)}
                                            scope="col"
                                            className="shadow-inner font-bold text-sm px-6 py-3 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-center gap-[1px]">
                                                {column}
                                                {sortConfig?.key === column ? (
                                                    sortConfig.direction === "asc" ? (
                                                        <IoCaretUpOutline color="black" />
                                                    ) : sortConfig.direction === "desc" ? (
                                                        <IoCaretDownOutline color="black" />
                                                    ) : (
                                                        <IoCaretUpOutline className="hidden" />
                                                    )
                                                ) : (
                                                    <IoCaretUpOutline className="hidden" />
                                                )}
                                            </div>
                                        </th>
                                    )
                            )}
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {paginatedRows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 ${selectedRows.includes(String(rowIndex))
                                    ? "bg-yellow-100 dark:bg-yellow-900"
                                    : rowIndex % 2
                                        ? "" // For even rows
                                        : "" // For odd rows
                                    }`}
                            >
                                <td className="hidden">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(String(rowIndex))}
                                        onChange={() => handleRowSelect(rowIndex)}
                                    />
                                </td>
                                {/* Index Column (Can be used for Testing) */}
                                {/* <td className="pl-5">{rowIndex + 1}</td> */}
                                {columns.map((column, index) => {
                                    const value = row[column];
                                    const columnData = data[column];
                                    const classNames = columnData.classNames
                                        ? columnData.classNames(value)
                                        : {};
                                    const content = columnData.renderValue
                                        ? columnData.renderValue(value)
                                        : typeof value === "boolean" && columnData.renderBoolean
                                            ? columnData.renderBoolean(value)
                                            : `${value}`;

                                    return (
                                        columnVisibility[column] && (
                                            <td
                                                key={index}
                                                className={`${classNames}`}
                                                onClick={() => handleRowSelect(rowIndex)}
                                            >
                                                <div className="px-3 py-2 text-gray-900 text-sm dark:text-white">
                                                    {content
                                                        ? content
                                                        : columnData.renderBoolean
                                                            ? columnData.renderBoolean(value)
                                                            : "false"}
                                                </div>
                                            </td>
                                        )
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="w-full mt-5 flex items-center justify-between">
                {pageSizeControl ? (
                    <div>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                ) : (
                    <div></div>
                )}
                {pagination && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="rounded-lg bg-gray-300 dark:bg-gray-800 p-2 disabled:opacity-50 cursor-pointer"
                        >
                            <IoChevronBackOutline className="text-black dark:text-white font-bold" />
                        </button>
                        <span className="text-base dark:text-white">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage + 1 === totalPages}
                            className="rounded-lg bg-gray-300 dark:bg-gray-800 p-2 disabled:opacity-50 cursor-pointer"
                        >
                            <IoChevronForwardOutline className="text-black dark:text-white font-bold" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataTable;
