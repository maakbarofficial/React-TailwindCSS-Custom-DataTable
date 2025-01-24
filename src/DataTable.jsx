import React, { useState, useMemo } from "react";
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

const DataTable = ({
    data,
    searchBar = false,
    excelExport = false,
    pagination = false,
    removableRows = false,
    pageSizeControl = false,
}) => {
    const columns = Object.keys(data);
    const rowCount = Math.max(...columns.map((column) => data[column].values.length));

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [sortConfig, setSortConfig] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);

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

    const exportToExcel = () => {
        const exportData = rows.map((row) => {
            const exportRow = {};
            columns.forEach((column) => {
                if (row[column]) {
                    exportRow[column] = row[column];
                } else {
                    exportRow[column] = "FALSE";
                }
            });
            return exportRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "data.xlsx");
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
                    {excelExport && (
                        <button
                            onClick={exportToExcel}
                            className="rounded-lg bg-[#303030] p-2"
                        >
                            <IoDownloadOutline
                                width={"26px"}
                                height={"26px"}
                                className={"!text-[#99e5be] cursor-pointer"}
                            />
                        </button>
                    )}
                    {removableRows && (
                        <button
                            onClick={handleDeleteSelectedRows}
                            disabled={selectedRows.length === 0}
                            className="rounded-lg bg-[#303030] p-2 disabled:opacity-50"
                        >
                            <IoTrashOutline
                                width={"26px"}
                                height={"26px"}
                                className={`${selectedRows.length === 0
                                    ? "cursor-default !text-red-300"
                                    : "cursor-pointer !text-red-400"
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
                            <th className="hidden px-6 py-3" scope="col">Actions</th>
                            {/* Index Column (Can be used for Testing) */}
                            {/* <th className="font-medium text-gray-300 text-[16px] pl-5">#</th> */}
                            {columns.map((column, index) => (
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
                            ))}
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
