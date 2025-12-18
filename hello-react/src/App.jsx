import { useState, useEffect } from "react";

import Item from "./Item.jsx";
import Header from "./Header.jsx";
import Form from "./Form.jsx";

import { Box, Container, Divider, List, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function App() {
	const api = "http://localhost:8800/tasks";

	// const [data, setData] = useState([]);

    // useEffect(() => {
    //     fetch(api).then(async res => {
    //         const tasks = await res.json();
    //         setData(tasks);
    //     });
    // }, []);

	// const [data, setData] = useState([
	// 	{ id: 3, name: "Apple", done: false },
	// 	{ id: 2, name: "Orange", done: true },
	// 	{ id: 1, name: "Egg", done: false },
	// ]);

	// const add = name => {
	// 	const id = data[0] ? data[0].id + 1 : 1;

	// 	if (name == "") return false;
	// 	setData([{ id, name, done: false }, ...data]);
	// };

	// const del = id => {
	// 	setData(data.filter(item => item.id !== id));
	// };

	// const toggle = id => {
	// 	setData(
	// 		data.map(item => {
	// 			if (item.id === id) item.done = !item.done;
	// 			return item;
	// 		})
	// 	);
	// };

	const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({

        queryKey: ["tasks"],

        queryFn: async () => {

            const res = await fetch(api);

            return res.json();

        }

    });

	// const add = async name => {
    //     const res = await fetch(api, {
    //         method: "POST",
    //         body: JSON.stringify({ name }),
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //     });

    //     const task = await res.json();
    //     setData([task, ...data]);
    // };

    // const del = id => {
    //     fetch(`${api}/${id}`, { method: "DELETE" });
    //     setData(data.filter(item => item.id !== id));
    // };

    // const toggle = id => {
    //     fetch(`${api}/${id}/toggle`, { method: "PUT" });
    //     setData(
    //         data.map(item => {
    //             if (item.id === id) item.done = !item.done;
    //             return item;
    //         })
    //     );
    // };

	const add = async name => {
        await fetch(api, {

            method: "POST",
            body: JSON.stringify({ name }),
            headers: {
                "Content-Type": "application/json"
            },
        });
        await queryClient.invalidateQueries(['tasks']);
    };

 

    const del = async id => {
        await fetch(`${api}/${id}`, { method: "DELETE" });

        await queryClient.invalidateQueries(['tasks']);
    };

 

    const toggle = async id => {
        await fetch(`${api}/${id}/toggle`, { method: "PUT" });

        await queryClient.invalidateQueries(["tasks"]);
    };

	if(isLoading) {
        return <Box>
            <Typography>Loading...</Typography>
        </Box>
    } 

    if (error) {
        return (
            <Box>
                <Typography>{error.message}</Typography>
            </Box>
        );
    }

	return (
		<div>
			<Header count={data.filter(item => !item.done).length} />

			<Container
				maxWidth="sm"
				sx={{ mt: 4 }}>
				<Form add={add} />

				<List>
					{data
						.filter(item => !item.done)
						.map(item => {
							return (
								<Item
									key={item.id}
									item={item}
									del={del}
									toggle={toggle}
								/>
							);
						})}
				</List>
				<Divider />
				<List>
					{data
						.filter(item => item.done)
						.map(item => {
							return (
								<Item
									key={item.id}
									item={item}
									del={del}
									toggle={toggle}
								/>
							);
						})}
				</List>
			</Container>
		</div>
	);
}
