accounts = {"name": "password"}
accounts_save = {"name": "1,0,0,1"}  # Example save data
accounts_votes = {"name": [0,0]}

def register(name, password):
    """Register a new account."""
    if name in accounts:
        return {"status": "error", "message": "Account already exists."}
    accounts[name] = password
    accounts_save[name] = ""  # Initialize with no saves
    return {"status": "success", "message": "Account created successfully."}

def log_in(name, password):
    """Log in to an account."""
    if name not in accounts:
        return {"status": "error", "message": "Account does not exist."}
    if accounts[name] != password:
        return {"status": "error", "message": "Incorrect password."}
    return {"status": "success", "message": "Logged in successfully."}

def add_save(name, save_data):
    """
    Add a save to the user's account.
    save_data should be a string in the format "1,0,0,1".
    """
    if name not in accounts_save:
        return {"status": "error", "message": "Account does not exist."}
    accounts_save[name] = save_data
    return {"status": "success", "message": "Save added successfully."}

def get_save(name):
    """
    Get all saves for a specific user.
    Returns a list of saves or an error message if the account does not exist.
    """
    if name not in accounts_save:
        return {"status": "error", "message": "Account does not exist."}
    return {"status": "success", "saves": accounts_save[name]}
