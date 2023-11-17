use std::io::{self, Write};

#[derive(Clone, Copy, PartialEq)]
enum Player {
    X,
    O,
}

#[derive(Clone, Copy, PartialEq)]
enum Cell {
    Empty,
    Mark(Player),
}

struct Board {
    cells: [[Cell; 3]; 3],
    current_player: Player,
}

impl Board {
    fn new() -> Board {
        Board {
            cells: [[Cell::Empty; 3]; 3],
            current_player: Player::X,
        }
    }

    fn print(&self) {
        for row in &self.cells {
            for cell in row {
                match cell {
                    Cell::Empty => print!("_ "),
                    Cell::Mark(Player::X) => print!("X "),
                    Cell::Mark(Player::O) => print!("O "),
                }
            }
            println!();
        }
    }

    fn make_move(&mut self, row: usize, col: usize) -> Result<(), &'static str> {
        if row < 3 && col < 3 && self.cells[row][col] == Cell::Empty {
            self.cells[row][col] = Cell::Mark(self.current_player);
            self.current_player = match self.current_player {
                Player::X => Player::O,
                Player::O => Player::X,
            };
            Ok(())
        } else {
            Err("Invalid move")
        }
    }

    fn check_winner(&self) -> Option<Player> {
        // Check rows
        for row in &self.cells {
            if row.iter().all(|&cell| cell == Cell::Mark(Player::X)) {
                return Some(Player::X);
            } else if row.iter().all(|&cell| cell == Cell::Mark(Player::O)) {
                return Some(Player::O);
            }
        }

        // Check columns
        for col in 0..3 {
            if (0..3).all(|row| self.cells[row][col] == Cell::Mark(Player::X)) {
                return Some(Player::X);
            } else if (0..3).all(|row| self.cells[row][col] == Cell::Mark(Player::O)) {
                return Some(Player::O);
            }
        }

        // Check diagonals
        if (0..3).all(|i| self.cells[i][i] == Cell::Mark(Player::X))
            || (0..3).all(|i| self.cells[i][i] == Cell::Mark(Player::O))
        {
            return Some(Player::X);
        }

        if (0..3).all(|i| self.cells[i][2 - i] == Cell::Mark(Player::X))
            || (0..3).all(|i| self.cells[i][2 - i] == Cell::Mark(Player::O))
        {
            return Some(Player::O);
        }

        None
    }
}

fn main() {
    let mut board = Board::new();

    loop {
        println!("Current board:");
        board.print();

        let player_mark = match board.current_player {
            Player::X => "X",
            Player::O => "O",
        };

        print!("Player {}'s turn. Enter row and column (e.g., 1 2): ", player_mark);
        io::stdout().flush().unwrap();

        let mut input = String::new();
        io::stdin().read_line(&mut input).expect("Failed to read line");

        let coordinates: Vec<usize> = input
            .split_whitespace()
            .filter_map(|s| s.parse().ok())
            .collect();

        if coordinates.len() == 2 {
            let (row, col) = (coordinates[0], coordinates[1]);

            match board.make_move(row, col) {
                Ok(_) => {
                    if let Some(winner) = board.check_winner() {
                        println!("Player {} wins!", match winner {
                            Player::X => "X",
                            Player::O => "O",
                        });
                        break;
                    }
                }
                Err(err) => println!("{}", err),
            }
        } else {
            println!("Invalid input. Please enter row and column separated by a space.");
        }
    }
}
