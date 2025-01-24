import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import {
    IoCaretDownOutline as CaretDownOutline,
    IoCaretUpOutline as CaretUpOutline,
    IoChevronBackOutline as ChevronBackOutline,
    IoChevronForwardOutline as ChevronForwardOutline,
    IoDownloadOutline as DownloadOutline,
    IoSearchOutline as SearchOutline,
    IoTrashOutline as TrashOutline,
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
                    <div className="flex md:w-[30%] w-[70%] items-center gap-5 rounded-lg px-3 py-2 bg-[#303030]">
                        <SearchOutline className={"!text-gray-300"} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full outline-none bg-transparent"
                        />
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
                            <DownloadOutline
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
                            <TrashOutline
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
            <div className="table-container">
                <table className="w-full overflow-x-auto max-w-[100vw]">
                    <thead>
                        <tr className="bg-[#303030] h-[50px]">
                            <th className="hidden">Actions</th>
                            <th className="font-medium text-gray-300 text-[16px] pl-5">#</th>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    onClick={() => handleSort(column)}
                                    className="font-medium text-gray-300 text-[16px] px-5 cursor-pointer"
                                >
                                    <div className="flex items-center justify-center gap-[1px]">
                                        {column}
                                        {sortConfig?.key === column ? (
                                            sortConfig.direction === "asc" ? (
                                                <CaretUpOutline className={"!fill-blue-400"} />
                                            ) : sortConfig.direction === "desc" ? (
                                                <CaretDownOutline className={"!fill-blue-400"} />
                                            ) : (
                                                <CaretUpOutline className={"hidden"} />
                                            )
                                        ) : (
                                            <CaretUpOutline className={"hidden"} />
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
                                className={`h-[50px] cursor-pointer ${selectedRows.includes(String(rowIndex))
                                    ? "bg-[#4d4d4d]"
                                    : rowIndex % 2
                                        ? "bg-[#242424]"
                                        : "bg-[#1f1f1f]"
                                    }`}
                            >
                                <td className="hidden">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(String(rowIndex))}
                                        onChange={() => handleRowSelect(rowIndex)}
                                    />
                                </td>
                                <td className="pl-5">{rowIndex + 1}</td>
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
                                            <div className="flex items-center justify-center whitespace-nowrap px-5">
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
                    <div className="rounded-lg py-[2px] pr-1 bg-[#303030] w-fit text-gray-400">
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="bg-transparent outline-none w-[80px] px-1"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
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
                            className="rounded-lg bg-[#303030] p-2 disabled:opacity-50"
                        >
                            <ChevronBackOutline className={"!text-gray-500"} />
                        </button>
                        <span className="text-sm">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage + 1 === totalPages}
                            className="rounded-lg bg-[#303030] p-2 disabled:opacity-50"
                        >
                            <ChevronForwardOutline className={"!text-gray-500"} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataTable;
