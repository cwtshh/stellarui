if [ -f .env ]; then
    export $(cat /env | xargs)
fi

USER_DATA=$(cat <<EOF
{
    "name": "$ADMIN_NAME"
    "email: "$ADMIN_EMAIL",
    "password": "$ADMIN_PASSWORD"
    "role": "admin"
}
EOF
)

curl -x POST $API_URL/user/create \
    -H "Content-Type: application/json" \
    -d "$USER_DATA"

if [ $? -eq 0 ]; then
    echo "Admin user created successfully"
else
    echo "Failed to create admin user"
fi