(function () {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    var tickets = data.tickets;
    var defaultTickets = [
        {
            "title": "Open a Ticket",
            "img_link": "open-ticket.png"
        },
        {
            "title": "Check Status of a Ticket",
            "img_link": "status-ticket.png"
        },
        {
            "title": "See My Closed Tickets",
            "img_link": "closed-ticket.png"
        },
        {
            "title": "Get Password Help",
            "img_link": "password-help.png"
        }
    ];

    try {
        tickets = JSON.parse(options.tickets);
    } catch (e) {
        gs.addErrorMessage("Instance option must be in a json format, default tickets set.");
        tickets = defaultTickets;
    }
    data.tickets = tickets;
})();