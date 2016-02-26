SELECT stops.name, stops.id FROM stops INNER JOIN trains ON stops.train_id = trains.id WHERE trains.id=1 GROUP BY stops.name, stops.id  ORDER BY stops.id ASC;
