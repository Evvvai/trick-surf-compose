FROM rabbitmq:3-management

# Define environment variables.
ENV RABBITMQ_USER guest
ENV RABBITMQ_PASSWORD guest

ENV RABBITMQ_PID_FILE_1 /etc/rabbitmq/
ENV RABBITMQ_PID_FILE_2 /var/lib/rabbitmq/
ENV RABBITMQ_PID_FILE_3 /var/log/rabbitmq/

ADD init.sh /init.sh
RUN chmod +x /init.sh
EXPOSE 5672
EXPOSE 15672

# Define default command
CMD ["/init.sh"]