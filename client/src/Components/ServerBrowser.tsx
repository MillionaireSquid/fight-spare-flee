import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Spinner from "react-bootstrap/Spinner";

function ServerBrowser() {
  const navigate = useNavigate();

  interface Room {
    id: string;
    name: string;
    owner: string;
    players: string[];
    maxPlayers: number;
  }

  const roomsAPI = "http://localhost:5000/rooms";
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const handleJoinRoom = (roomId: string) => {
    console.log(roomId);
    // TODO: Implement join room logic
    navigate("/play");
  };

  const handleBack = () => {
    navigate("/");
  };

  const fetchRooms = async () => {
    setLoading(true);

    try {
      const response = await fetch(roomsAPI);

      if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.statusText}`);
      }

      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const createRoomRow = (room: Room) => {
    return (
      <Stack key={room.id} direction="horizontal" className="server-browser-row" gap={3}>
        <h2 className="m-auto">{room.name}</h2>
        <div className="vr" />
        <h3 className="m-auto">
          {room.players.length}/{room.maxPlayers}
        </h3>
        <p className="m-auto">{room.owner}</p>
        <Button onClick={() => handleJoinRoom(room.id)} variant="success" className="m-auto">
          Join
        </Button>
      </Stack>
    );
  };

  return (
    <>
      <Stack direction="horizontal" gap={3} className="mb-4">
        <Button onClick={handleBack} variant="primary">
          Back
        </Button>
        <h1>Server Browser</h1>
      </Stack>

      <Stack gap={3} className="server-browser">
        <Stack gap={2} direction="horizontal">
          <Button onClick={fetchRooms} variant="primary" disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </Stack>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {!loading && rooms.map(createRoomRow)}
      </Stack>
    </>
  );
}

export default ServerBrowser;
