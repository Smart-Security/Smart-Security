import React, { useState } from 'react';
import strings from './../../../../constants/strings'
import "./users.component.css"
import { DataGrid } from '@mui/x-data-grid';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import { useTheme } from '@mui/material/styles';
import Zoom from '@mui/material/Zoom';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
// import { createFakeServer } from '@mui/x-data-grid-generator';

// const { columns, initialState, useQuery } = createFakeServer({}, SERVER_OPTIONS);

const columns = [
    { field: 'name', headerName: 'Name', width: 300},
    { field: 'email', headerName: 'Email', width: 300 },
    { 
        id : "divisions",
        field: 'divisionDtos', headerName: 'Divisions', width: 300, sortable: false, 
        renderCell: (divisions) => {
            return (
                <Stack direction="row" spacing={1}>
                    {
                        divisions.row.divisionDtos.map((division, index) => <Chip key={`${divisions.name + ""}`} label={division.name} />)
                    }
                </Stack>
            );
        }
    },
];
  
const rows = [
    {
        id: "f045b8b0-788a-4415-a45c-a8f0193d288e",
        uuid: "f045b8b0-788a-4415-a45c-a8f0193d288e",
        email: "example@mail.com",
        name: "aa",
        age: 10,
        divisionDtos: [
            {
                id: "123",
                name: "Lab 2"
            },
            {
                id: "128",
                name: "Lab 3"
            },
            {
                id: "123",
                name: "Lab 4"
            }
        ]
    },
    {
        id: "9c95f89f-e8ec-4e2d-a2f0-a141f2c74a8b",
        uuid: "9c95f89f-e8ec-4e2d-a2f0-a141f2c74a8b",
        email: "dani@gmail.com",
        name: "aa",
        age: 10,
        divisionDtos: [
            {
                name: "Lab 2"
            },
            {
                name: "Lab 3"
            },
            {
                name: "Lab 4"
            }
        ]
    },
    {
        id: "7d8a9c92-454d-4aff-be9f-7b827f90111a",
        uuid: "7d8a9c92-454d-4aff-be9f-7b827f90111a",
        email: "daniel@gmail.com",
        name: "Daniel Fernandes",
        age: 26,
        divisionDtos: [
            {
                name: "Lab 2"
            },
            {
                name: "Lab 3"
            },
            {
                name: "Lab 4"
            },
            {
                name: "Lab 4"
            },
            {
                name: "Lab 4"
            },
        ]
    }
];

export default function Users(props) {
    
    const theme = useTheme();
    
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5)

    // const queryOptions = React.useMemo(
    //     () => ({
    //       page,
    //       pageSize,
    //     }),
    //     [page, pageSize],
    // );

    //const { isLoading, data, pageInfo } = useQuery(queryOptions);

    // Some API clients return undefined while loading
    // Following lines are here to prevent `rowCountState` from being undefined during the loading
    // const [rowCountState, setRowCountState] = React.useState(
    //     pageInfo?.totalRowCount || 0,
    // );

    // React.useEffect(() => {
    //     setRowCountState((prevRowCountState) =>
    //       pageInfo?.totalRowCount !== undefined
    //         ? pageInfo?.totalRowCount
    //         : prevRowCountState,
    //     );
    // }, [pageInfo?.totalRowCount, setRowCountState]);

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };
    const handleChangeRowsPerPage = (event) => {
        //setRowsPerPage(+event.target.value);
        // setPage(0);
    };

    return (
        <div className="users-container">
            <h1 className="content-title">{strings.adminstration.users.title}</h1>
            <div className="users-data-table-container">
                    <DataGrid
                        loading={true}
                        rows={rows}
                        columns={columns}
                        pageSize={pageSize}
                        count={3}
                        rowsPerPageOptions={[10, 25, 100]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        onPageChange={(newPage) => setPage(newPage)}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        checkboxSelection
                        paginationMode="server"
                    />
            </div>
            <Zoom
                in={true}
                timeout={transitionDuration}
                style={{
                    transitionDelay: `${transitionDuration.exit}ms`,
                }}
                unmountOnExit
                >
                <Fab color="primary" variant="extended" className="add-fab-button">
                    <NavigationIcon sx={{ mr: 1 }} />
                    { strings.adminstration.users.add }
                </Fab>
            </Zoom>
            
        </div>
    );
}