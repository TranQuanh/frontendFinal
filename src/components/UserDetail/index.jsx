import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./styles.css";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://3c7cpk-8081.csb.app/api/user/${userId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user:", error));
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>
        {user.first_name} {user.last_name}
      </h2>
      <p>
        <strong>Location:</strong> {user.location}
      </p>
      <p>
        <strong>Occupation:</strong> {user.occupation}
      </p>
      <p>
        <strong>Description:</strong> {user.description}
      </p>
      <p>
        <Link className="photo-link-button" to={`/photos/${user._id}`}>
          Xem ảnh của {user.first_name}
        </Link>
      </p>
    </div>
  );
}

export default UserDetail;
