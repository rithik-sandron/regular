use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct Uuid {
    last_timestamp: u128,
    counter: u16,
}

impl Uuid {
    pub fn new() -> Self {
        Uuid {
            last_timestamp: 0,
            counter: 0,
        }
    }

    pub fn generate_id(&mut self) -> u128 {
        let timestamp: u128 = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_secs().into();

        if timestamp == self.last_timestamp {
            self.counter += 1;
        } else {
            self.last_timestamp = timestamp;
            self.counter = 0;
        }

        (timestamp << 16) | (self.counter as u128)
    }
}